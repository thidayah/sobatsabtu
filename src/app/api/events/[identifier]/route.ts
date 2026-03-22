import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { checkUUID, generateSlug } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;

    // Check if identifier is UUID or slug
    const isUUID = checkUUID(identifier)

    // Build query based on identifier type
    let query = supabaseServer
      .from('ss_events')
      .select('*');

    if (isUUID) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('slug', identifier);
    }

    // Execute query
    const { data: event, error } = await query.single();

    if (error) {
      console.error('Supabase error:', error);

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            message: 'Event not found',
            error: 'The requested event does not exist',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch event',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: isUUID ? 'Event retrieved by ID successful' : 'Event retrieved by slug successful',
      data: event,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    const body = await request.json();

    // First, find the event to update
    let findQuery = supabaseServer
      .from('ss_events')
      .select('id, slug');

    // Check if identifier is UUID or slug
    if (checkUUID(identifier)) {
      findQuery = findQuery.eq('id', identifier);
    } else {
      findQuery = findQuery.eq('slug', identifier);
    }

    const { data: existingEvent, error: findError } = await findQuery.single();;

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            message: 'Event not found',
            error: 'The requested event does not exist',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to find event',
          error: findError.message,
        },
        { status: 500 }
      );
    }

    // Validate max_participants if provided
    if (body.max_participants !== undefined && body.max_participants <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid max_participants',
          error: 'max_participants must be greater than 0',
        },
        { status: 400 }
      );
    }

    // Handle slug update if name changed
    let slug = body.slug;
    if (body.name && !body.slug) {
      slug = generateSlug(body.name);

      // Check if new slug already exists and is not the current event
      if (slug !== existingEvent.slug) {
        const { data: slugExists } = await supabaseServer
          .from('ss_events')
          .select('slug')
          .eq('slug', slug)
          .neq('id', existingEvent.id)
          .single();

        if (slugExists) {
          const timestamp = Date.now();
          slug = `${slug}-${timestamp}`;
        }
      }
    }

    // Prepare update data (only include fields that are provided)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.descriptions !== undefined) updateData.descriptions = body.descriptions;
    if (slug !== undefined) updateData.slug = slug;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.time !== undefined) updateData.time = body.time;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.current_participants !== undefined) updateData.current_participants = body.current_participants;
    if (body.max_participants !== undefined) updateData.max_participants = body.max_participants;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    // Update the event
    const { data: event, error: updateError } = await supabaseServer
      .from('ss_events')
      .update(updateData)
      .eq('id', existingEvent.id)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase error:', updateError);

      if (updateError.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            message: 'Duplicate event',
            error: 'An event with this slug already exists',
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update event',
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      data: event,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;

    // First, check if event exists and has registrations
    let findQuery = supabaseServer
      .from('ss_events')
      .select('id, name, slug')

    // Check if identifier is UUID or slug
    if (checkUUID(identifier)) {
      findQuery = findQuery.eq('id', identifier);
    } else {
      findQuery = findQuery.eq('slug', identifier);
    }

    const { data: existingEvent, error: findError } = await findQuery.single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            message: 'Event not found',
            error: 'The requested event does not exist',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to find event',
          error: findError.message,
        },
        { status: 500 }
      );
    }

    // Check if there are registrations for this event
    const { data: registrations, error: regError } = await supabaseServer
      .from('ss_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', existingEvent.id);

    if (regError) {
      console.error('Error checking registrations:', regError);
    }

    const hasRegistrations = registrations && registrations.length > 0;

    // Delete the event (registrations will be cascade deleted due to foreign key)
    const { error: deleteError } = await supabaseServer
      .from('ss_events')
      .delete()
      .eq('id', existingEvent.id);

    if (deleteError) {
      console.error('Supabase error:', deleteError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to delete event',
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    // Return success response with warning if registrations were deleted
    return NextResponse.json({
      success: true,
      message: hasRegistrations
        ? `Event "${existingEvent.name}" deleted successfully along with its registrations`
        : `Event "${existingEvent.name}" deleted successfully`,
      data: {
        deleted_event: existingEvent,
        registrations_deleted: hasRegistrations,
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