import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    // const month = searchParams.get('month');

    // Get total members
    const { count: totalMembers, error: membersError } = await supabaseServer
      .from('ss_members')
      .select('*', { count: 'exact', head: true });

    if (membersError) {
      console.error('Error fetching total members:', membersError);
    }

    // Get total events
    const { count: totalEvents, error: eventsError } = await supabaseServer
      .from('ss_events')
      .select('*', { count: 'exact', head: true });

    if (eventsError) {
      console.error('Error fetching total events:', eventsError);
    }

    // Get total registrations
    const { count: totalRegistrations, error: registrationsError } = await supabaseServer
      .from('ss_registrations')
      .select('*', { count: 'exact', head: true });

    if (registrationsError) {
      console.error('Error fetching total registrations:', registrationsError);
    }

    // Get active events (is_active = true and date >= current_date)
    const today = new Date().toISOString().split('T')[0];
    const { count: activeEvents, error: activeError } = await supabaseServer
      .from('ss_events')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gte('date', today);

    if (activeError) {
      console.error('Error fetching active events:', activeError);
    }

    return NextResponse.json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: {
        total_members: totalMembers || 0,
        total_events: totalEvents || 0,
        total_registrations: totalRegistrations || 0,
        active_events: activeEvents || 0,
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