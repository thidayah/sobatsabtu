import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

interface Member {
  id: string;
  full_name: string;
  email: string;
  ig_username: string;
}

interface Registrations {
  member_id: string;
  status: string;
  member: Member | null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Build date filter for registrations
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

    // Get registrations with member info within date range
    const { data: registrations, error: regError } = await supabaseServer
      .from('ss_registrations')
      .select(`
        member_id,
        status,
        member:ss_members (
          id,
          full_name,
          email,
          ig_username
        )
      `)
      .eq('status', 'confirmed')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .overrideTypes<Registrations[]>();

    if (regError) {
      console.error('Error fetching registrations:', regError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch registrations',
          error: regError.message,
        },
        { status: 500 }
      );
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No registrations found',
        data: [],
        filters: {
          year: year || new Date().getFullYear().toString(),
          month: month || null,
          limit,
        },
      });
    }

    // Count registrations per member
    const memberParticipationMap = new Map();
    (registrations ?? []).forEach(reg => {
      const member = reg.member;
      if (!member) return;

      const currentCount = memberParticipationMap.get(reg.member_id) || {
        member_id: reg.member_id,
        full_name: member.full_name,
        email: member.email,
        ig_username: member.ig_username,
        total_events: 0,
      };
      currentCount.total_events++;
      memberParticipationMap.set(reg.member_id, currentCount);
    });

    // Convert to array and sort by total_events (descending)
    const activeMembers = Array.from(memberParticipationMap.values());
    activeMembers.sort((a, b) => b.total_events - a.total_events);

    // Return top N members
    const topMembers = activeMembers.slice(0, limit);

    return NextResponse.json({
      success: true,
      message: 'Active members retrieved successfully',
      data: topMembers,
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