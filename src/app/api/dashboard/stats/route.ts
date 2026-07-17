import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    // const month = searchParams.get('month');

    const today = new Date().toISOString().split('T')[0];

    const [
      { count: totalMembers, error: membersError },
      { count: totalEvents, error: eventsError },
      { count: totalRegistrations, error: registrationsError },
      { count: activeEvents, error: activeError },
    ] = await Promise.all([
      supabaseServer.from('ss_members').select('*', { count: 'exact', head: true }),
      supabaseServer.from('ss_events').select('*', { count: 'exact', head: true }),
      supabaseServer.from('ss_registrations').select('*', { count: 'exact', head: true }),
      supabaseServer
        .from('ss_events')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('date', today),
    ]);

    if (membersError) {
      console.error('Error fetching total members:', membersError);
    }
    if (eventsError) {
      console.error('Error fetching total events:', eventsError);
    }
    if (registrationsError) {
      console.error('Error fetching total registrations:', registrationsError);
    }
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