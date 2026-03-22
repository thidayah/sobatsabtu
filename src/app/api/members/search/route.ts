import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const igUsername = searchParams.get('ig_username');

    // Validate at least one search parameter is provided
    if (!email && !igUsername) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing search parameter',
          error: 'Please provide either email or ig_username parameter',
        },
        { status: 400 }
      );
    }

    // Build query based on provided parameters
    let query = supabaseServer
      .from('ss_members')
      .select('*');

    // Add conditions based on provided parameters
    if (email && igUsername) {
      query = query.or(`email.eq.${email},ig_username.eq.${igUsername}`);
    } else if (email) {
      query = query.eq('email', email);
    } else if (igUsername) {
      query = query.eq('ig_username', igUsername);
    }

    // Execute query
    const { data: members, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to search members',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Check if any members found
    if (!members || members.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'No member found',
          data: null,
          // search_params: {
          //   email: email || null,
          //   ig_username: igUsername || null,
          // },
        },
        { status: 200 }
      );
    }

    // Return success response with member data
    return NextResponse.json({
      success: true,
      message: members.length === 1 
        ? 'Member found successfully' 
        : `${members.length} members found`,
      data: members.length === 1 ? members[0] : members,
      // search_params: {
      //   email: email || null,
      //   ig_username: igUsername || null,
      // },
      // count: members.length,
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