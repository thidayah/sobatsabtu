import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { generateUniqueCode } from '@/lib/utils';
import { sendRegistrationEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const eventId = searchParams.get('event_id');
    const slug = searchParams.get('slug');
    const search = searchParams.get('search') || '';

    // Validate page and limit
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit));
    const offset = (validPage - 1) * validLimit;

    // Start building query
    let query = supabaseServer
      .from('ss_registrations')
      .select(`
        *,
        event:ss_events (*),
        member:ss_members (*)
      `, { count: 'exact', head: false });

    // Filter by event_id if provided
    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    // Filter by slug if provided
    if (slug) {
      // First find event by slug
      const { data: event } = await supabaseServer
        .from('ss_events')
        .select('id')
        .eq('slug', slug)
        .single();

      if (event) {
        query = query.eq('event_id', event.id);
      } else {
        // If event not found, return empty results
        return NextResponse.json({
          success: true,
          message: 'No registrations found',
          data: {
            items: [],
            pagination: {
              page: validPage,
              limit: validLimit,
              total: 0,
              total_pages: 0,
              has_next_page: false,
              has_prev_page: false,
            },
            filters: {
              event_id: eventId || null,
              slug: slug || null,
              search: search || null,
            }
          }
        });
      }
    }

    // Apply search filter (full_name or email from member)
    if (search) {
      // First find members matching search
      const { data: members } = await supabaseServer
        .from('ss_members')
        .select('id')
        .or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);

      if (members && members.length > 0) {
        const memberIds = members.map(m => m.id);
        query = query.in('member_id', memberIds);
      } else {
        // If no members found, return empty results
        return NextResponse.json({
          success: true,
          message: 'No registrations found',
          data: {
            items: [],
            pagination: {
              page: validPage,
              limit: validLimit,
              total: 0,
              total_pages: 0,
              has_next_page: false,
              has_prev_page: false,
            },
            filters: {
              event_id: eventId || null,
              slug: slug || null,
              search: search || null,
            }
          }
        });
      }
    }

    // Apply pagination
    query = query.range(offset, offset + validLimit - 1);

    // Execute query
    const { data: registrations, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch registrations',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Calculate pagination metadata
    const total = count || 0;
    const totalPages = Math.ceil(total / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPrevPage = validPage > 1;

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registrations list retrieved successfully',
      data: {
        items: registrations,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          total_pages: totalPages,
          has_next_page: hasNextPage,
          has_prev_page: hasPrevPage,
        },
        filters: {
          event_id: eventId || null,
          slug: slug || null,
          search: search || null,
        },
      },

    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'event_id',
      'full_name',
      'email',
      'gender',
      'emergency_contact_name',
      'emergency_contact_phone'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: `Required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          error: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // 1. Check event availability
    const { data: event, error: eventError } = await supabaseServer
      .from('ss_events')
      .select('*')
      .eq('id', body.event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event not found',
          error: 'The specified event does not exist',
        },
        { status: 404 }
      );
    }

    // Validate event is active
    if (!event.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event is not active',
          error: 'This event is currently inactive and cannot accept registrations',
        },
        { status: 400 }
      );
    }

    // Validate event date is not passed
    const eventDate = new Date(`${event.date}T${event.time}`);
    const currentDate = new Date();
    
    if (eventDate < currentDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event has already passed',
          error: 'Cannot register for past events',
        },
        { status: 400 }
      );
    }

    // Validate participant quota
    if (event.current_participants >= event.max_participants) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event is full',
          error: `Maximum participants (${event.max_participants}) has been reached`,
        },
        { status: 400 }
      );
    }

    // 2. Check if member already exists (by email OR ig_username)
    let memberId = null;
    let isExistingMember = false;
    let memberData = null;

    // Build query to check existing member
    let memberQuery = supabaseServer
      .from('ss_members')
      .select('*')
      .or(`email.eq.${body.email},ig_username.eq.${body.ig_username || ''}`)
      .maybeSingle();

    const { data: existingMember, error: memberFindError } = await memberQuery;

    if (memberFindError && memberFindError.code !== 'PGRST116') {
      console.error('Error finding member:', memberFindError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to check member existence',
          error: memberFindError.message,
        },
        { status: 500 }
      );
    }

    if (existingMember) {
      // Update existing member
      isExistingMember = true;
      
      const updateData: any = {
        full_name: body.full_name,
        email: body.email,
        gender: body.gender,
        emergency_contact_name: body.emergency_contact_name,
        emergency_contact_phone: body.emergency_contact_phone,
        updated_at: new Date().toISOString(),
      };

      if (body.ig_username !== undefined) updateData.ig_username = body.ig_username;
      if (body.medical_notes !== undefined) updateData.medical_notes = body.medical_notes;

      const { data: updatedMember, error: updateError } = await supabaseServer
        .from('ss_members')
        .update(updateData)
        .eq('id', existingMember.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating member:', updateError);
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to update member',
            error: updateError.message,
          },
          { status: 500 }
        );
      }

      memberId = updatedMember.id;
      memberData = updatedMember;
    } else {
      // Insert new member
      const memberDataInsert = {
        full_name: body.full_name,
        email: body.email,
        ig_username: body.ig_username || null,
        gender: body.gender,
        emergency_contact_name: body.emergency_contact_name,
        emergency_contact_phone: body.emergency_contact_phone,
        medical_notes: body.medical_notes || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: newMember, error: insertError } = await supabaseServer
        .from('ss_members')
        .insert(memberDataInsert)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting member:', insertError);
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create member',
            error: insertError.message,
          },
          { status: 500 }
        );
      }

      memberId = newMember.id;
      memberData = newMember;
    }

    // 3. Check if member already registered for this event
    const { data: existingRegistration, error: regCheckError } = await supabaseServer
      .from('ss_registrations')
      .select('*')
      .eq('event_id', body.event_id)
      .eq('member_id', memberId)
      .maybeSingle();

    if (regCheckError && regCheckError.code !== 'PGRST116') {
      console.error('Error checking registration:', regCheckError);
    }

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Already registered',
          error: 'You have already registered for this event',
          data: {
            registration: existingRegistration,
          },
        },
        { status: 409 }
      );
    }

    // 4. Create registration
    const registrationCode = generateUniqueCode();
    
    const registrationData = {
      event_id: body.event_id,
      member_id: memberId,
      code: registrationCode,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: registration, error: regError } = await supabaseServer
      .from('ss_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (regError) {
      console.error('Error creating registration:', regError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create registration',
          error: regError.message,
        },
        { status: 500 }
      );
    }

    // 5. Update event current_participants
    const { error: updateEventError } = await supabaseServer
      .from('ss_events')
      .update({
        current_participants: event.current_participants + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.event_id);

    if (updateEventError) {
      console.error('Error updating event participants:', updateEventError);
    }

    // 6. Format event date for email
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 7. Send registration confirmation email
    const emailResult = await sendRegistrationEmail(memberData.email, {
      memberName: memberData.full_name,
      eventName: event.name,
      eventDate: formattedDate,
      eventTime: event.time.substring(0, 5),
      eventLocation: event.location,
      registrationCode: registration.code,
      status: registration.status,
    });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // Don't fail the registration if email fails, just log it
    }

    // 8. Get complete registration data with member info
    const { data: completeRegistration, error: fetchError } = await supabaseServer
      .from('ss_registrations')
      .select(`
        *,
        event:ss_events (*),
        member:ss_members (*)
      `)
      .eq('id', registration.id)
      .single();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'You have registered for this event. Check your email for confirmation.',
        // message: isExistingMember 
        //   ? 'Registration successful (existing member updated)'
        //   : 'Registration successful (new member created)',
        data: {
          registration: completeRegistration || registration,
          member_status: isExistingMember ? 'updated' : 'created',
          event_remaining_slots: event.max_participants - (event.current_participants + 1),
          email_sent: emailResult.success,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}