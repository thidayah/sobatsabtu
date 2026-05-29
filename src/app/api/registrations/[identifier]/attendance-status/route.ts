import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;

    // Validate registration Code
    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration Code is required',
          error: 'Missing registration code',
        },
        { status: 400 }
      );
    }

    // Check if registration exists
    let findQuery = supabaseServer
      .from('ss_registrations')
      .select(`
        id, code, is_attendance,
        event:ss_events (name, date, is_active),
        member:ss_members (full_name, email, ig_username, gender)
      `,
        { count: 'exact', head: false }
      );

    findQuery = findQuery.eq('code', identifier);

    const { data: existingRegistration, error: findError } = await findQuery.single<any>();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            message: 'Registration not found',
            error: 'The specified registration does not exist',
          },
          { status: 404 }
        );
      }

      console.error('Error finding registration:', findError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to find registration',
          error: findError.message,
        },
        { status: 500 }
      );
    }

    // Validate event is active
    if (!existingRegistration.event.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event is not active',
          error: 'This event is currently inactive and cannot accept attended',
        },
        { status: 400 }
      );
    }

    // Validate event date is not passed
    const eventDate = new Date(`${existingRegistration.event.date}T23:59:59.000Z`); // Set time to end of day for comparison
    const currentDate = new Date();    

    if (eventDate < currentDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event has already passed',
          error: 'Cannot mark attendance for past events',
        },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Member ${existingRegistration.is_attendance ? 'marked as attended' : 'marked as not attended'}`,
      data: existingRegistration,
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