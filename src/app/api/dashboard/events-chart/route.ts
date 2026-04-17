import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Get all events for the specified year
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data: events, error: eventsError } = await supabaseServer
      .from('ss_events')
      .select('id, date, max_participants')
      .gte('date', startDate)
      .lte('date', endDate);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch events',
          error: eventsError.message,
        },
        { status: 500 }
      );
    }

    // Get all registrations for events in the specified year
    const eventIds = events?.map(e => e.id) || [];
    
    let registrationsData: any[] = [];
    if (eventIds.length > 0) {
      const { data: registrations, error: regError } = await supabaseServer
        .from('ss_registrations')
        .select('event_id')
        .in('event_id', eventIds)
        .eq('status', 'confirmed');

      if (!regError) {
        registrationsData = registrations || [];
      }
    }

    // Count registrations per event
    const registrationCountMap = new Map();
    registrationsData.forEach(reg => {
      const count = registrationCountMap.get(reg.event_id) || 0;
      registrationCountMap.set(reg.event_id, count + 1);
    });

    // Initialize monthly arrays
    const monthlyTotalQuota = Array(12).fill(0);
    const monthlyTotalParticipants = Array(12).fill(0);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Aggregate data per month
    events?.forEach(event => {
      const month = new Date(event.date).getMonth();
      monthlyTotalQuota[month] += event.max_participants;
      monthlyTotalParticipants[month] += registrationCountMap.get(event.id) || 0;
    });

    // Format data for line chart
    const chartData = monthNames.map((name, index) => ({
      month: name,
      quota: monthlyTotalQuota[index],
      participants: monthlyTotalParticipants[index],
    }));

    return NextResponse.json({
      success: true,
      message: 'Events per month retrieved successfully',
      data: {
        year,
        chart_data: chartData,
        total_events: events?.length || 0,
        total_quota: monthlyTotalQuota.reduce((a, b) => a + b, 0),
        total_participants: monthlyTotalParticipants.reduce((a, b) => a + b, 0),
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