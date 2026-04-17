import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Build date filter
    let startDate: string;
    let endDate: string;

    if (month) {
      // Filter by specific month
      const [yearStr, monthStr] = month.split('-');
      const firstDay = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
      const lastDay = new Date(parseInt(yearStr), parseInt(monthStr), 0);
      startDate = firstDay.toISOString().split('T')[0];
      endDate = lastDay.toISOString().split('T')[0];
    } else if (year) {
      // Filter by year
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      // Default to current year
      const currentYear = new Date().getFullYear();
      startDate = `${currentYear}-01-01`;
      endDate = `${currentYear}-12-31`;
    }

    // Get all events with their registrations
    const { data: events, error: eventsError } = await supabaseServer
      .from('ss_events')
      .select('id, name, slug, date, max_participants, current_participants')
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

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No events found',
        data: [],
      });
    }

    // Get registration counts per event
    const eventIds = events.map(e => e.id);
    const { data: registrations, error: regError } = await supabaseServer
      .from('ss_registrations')
      .select('event_id')
      .in('event_id', eventIds)
      .eq('status', 'confirmed');

    if (regError) {
      console.error('Error fetching registrations:', regError);
    }

    // Count registrations per event
    const registrationCountMap = new Map();
    registrations?.forEach(reg => {
      const count = registrationCountMap.get(reg.event_id) || 0;
      registrationCountMap.set(reg.event_id, count + 1);
    });

    // Calculate popularity and sort
    const eventsWithPopularity = events.map(event => ({
      id: event.id,
      name: event.name,
      slug: event.slug,
      date: event.date,
      max_participants: event.max_participants,
      current_participants: event.current_participants,
      total_registrations: registrationCountMap.get(event.id) || 0,
      fill_rate: ((registrationCountMap.get(event.id) || 0) / event.max_participants) * 100,
    }));

    // Sort by total registrations (descending)
    eventsWithPopularity.sort((a, b) => b.total_registrations - a.total_registrations);

    // Return top N events
    const topEvents = eventsWithPopularity.slice(0, limit);

    return NextResponse.json({
      success: true,
      message: 'Popular events retrieved successfully',
      data: topEvents,
      filters: {
        year: year || new Date().getFullYear().toString(),
        month: month || null,
        limit,
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