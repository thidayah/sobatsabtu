import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isActive = searchParams.get('is_active');
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = (searchParams.get('sort_order') || 'desc') as 'asc' | 'desc';

    // Validate page and limit
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit));
    const offset = (validPage - 1) * validLimit;

    // Validate sort_by
    const validSortFields = ['created_at', 'total_events'];
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';

    // Start building query for members
    let query = supabaseServer
      .from('ss_members')
      .select('*', { count: 'exact', head: false });

    // Apply is_active filter
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query = query.eq('is_active', isActive === 'true');
    }

    // Apply search filter (full_name, email, ig_username)
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,ig_username.ilike.%${search}%`
      );
    }

    // Execute query to get members first
    const { data: members, error: membersError, count } = await query;

    if (membersError) {
      console.error('Supabase error:', membersError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch members',
          error: membersError.message,
        },
        { status: 500 }
      );
    }

    if (!members || members.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No members found',
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
            is_active: isActive !== null && isActive !== undefined && isActive !== '' ? isActive === 'true' : null,
            search: search || null,
            start_date: startDate || null,
            end_date: endDate || null,
            sort_by: validSortBy,
            sort_order: sortOrder,
          },
        },
      });
    }

    // Get member IDs
    const memberIds = members.map(member => member.id);

    // Build query for registrations to get event counts
    let registrationsQuery = supabaseServer
      .from('ss_registrations')
      .select(`
        member_id,
        is_attendance,
        event:ss_events!inner (*)
      `)
      .in('member_id', memberIds)
      .eq('status', 'confirmed');

    // Apply date range filter on events
    if (startDate) {
      registrationsQuery = registrationsQuery.gte('event.date', startDate);
    }
    if (endDate) {
      registrationsQuery = registrationsQuery.lte('event.date', endDate);
    }

    const { data: registrations, error: registrationsError } = await registrationsQuery;

    if (registrationsError) {
      console.error('Error fetching registrations:', registrationsError);
      // Continue without event counts if error occurs
    }

    // Calculate total events and attendance per member
    const eventCountMap = new Map<string, number>();
    const attendanceCountMap = new Map<string, number>();
    if (registrations) {
      registrations.forEach(reg => {
        const memberId = reg.member_id;
        eventCountMap.set(memberId, (eventCountMap.get(memberId) || 0) + 1);
        if (reg.is_attendance) {
          attendanceCountMap.set(memberId, (attendanceCountMap.get(memberId) || 0) + 1);
        }
      });
    }

    // Add total_events and total_events_attendance to each member
    let membersWithEventCount = members.map(member => ({
      ...member,
      total_events: eventCountMap.get(member.id) || 0,
      total_events_attendance: attendanceCountMap.get(member.id) || 0,
    }));

    // Apply sorting based on sort_by
    if (validSortBy === 'created_at') {
      membersWithEventCount.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (validSortBy === 'total_events') {
      membersWithEventCount.sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.total_events - b.total_events 
          : b.total_events - a.total_events;
      });
    }

    // Apply pagination to the final data
    const paginatedMembers = membersWithEventCount.slice(offset, offset + validLimit);

    // Calculate pagination metadata
    const total = membersWithEventCount.length;
    const totalPages = Math.ceil(total / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPrevPage = validPage > 1;

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Members list retrieved successfully',
      data: {
        items: paginatedMembers,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          total_pages: totalPages,
          has_next_page: hasNextPage,
          has_prev_page: hasPrevPage,
        },
        filters: {
          is_active: isActive !== null && isActive !== undefined && isActive !== '' ? isActive === 'true' : null,
          search: search || null,
          start_date: startDate || null,
          end_date: endDate || null,
          sort_by: validSortBy,
          sort_order: sortOrder,
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