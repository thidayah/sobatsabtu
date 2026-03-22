import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isActive = searchParams.get('is_active');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = (searchParams.get('sort_order') || 'desc') as 'asc' | 'desc';
    const search = searchParams.get('search') || '';

    // Validate page and limit
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit));
    const offset = (validPage - 1) * validLimit;

    // Validate sort_by
    const validSortFields = ['created_at', 'date', 'name'];
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';

    // Start building query
    let query = supabaseServer
      .from('ss_events')
      .select('*', { count: 'exact', head: false });

    // Apply is_active filter
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query = query.eq('is_active', isActive === 'true');
    }

    // Apply search filter (name or location)
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(validSortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + validLimit - 1);

    // Execute query
    const { data: events, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch events',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Calculate pagination metadata
    const total = count || 0;
    const total_pages = Math.ceil(total / validLimit);
    const has_next_page = validPage < total_pages;
    const has_prev_page = validPage > 1;

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'All events list successful',
      data: {
        items: events,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          total_pages,
          has_next_page,
          has_prev_page,
        },
        filters: {
          is_active: isActive !== null && isActive !== undefined && isActive !== '' ? isActive === 'true' : null,
          sort_by: validSortBy,
          sort_order: sortOrder,
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
    const requiredFields = ['name', 'date', 'time', 'location', 'max_participants', 'type'];
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

    // Validate max_participants is positive number
    if (body.max_participants <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid max_participants',
          error: 'max_participants must be greater than 0',
        },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    let slug = body.slug;
    if (!slug) {
      slug = generateSlug(body.name);
      
      // Check if slug already exists
      const { data: existingEvent } = await supabaseServer
        .from('ss_events')
        .select('slug')
        .eq('slug', slug)
        .single();
      
      if (existingEvent) {
        // Add timestamp to make slug unique
        const timestamp = Date.now();
        slug = `${slug}-${timestamp}`;
      }
    }

    // Prepare event data
    const eventData = {
      name: body.name,
      descriptions: body.descriptions || null,
      slug: slug,
      image_url: body.image_url || null,
      date: body.date,
      time: body.time,
      location: body.location,
      current_participants: body.current_participants || 0,
      max_participants: body.max_participants,
      type: body.type,
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into database
    const { data: event, error } = await supabaseServer
      .from('ss_events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // Check for duplicate slug error
      if (error.code === '23505') {
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
          message: 'Failed to create event',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        data: event,
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