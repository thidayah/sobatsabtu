import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Get all registrations for the specified year
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data: registrations, error } = await supabaseServer
      .from('ss_registrations')
      .select('created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch registrations',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Initialize months array (Jan = 0, Dec = 11)
    const monthlyData = Array(12).fill(0);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Count registrations per month
    registrations?.forEach(reg => {
      const month = new Date(reg.created_at).getMonth();
      monthlyData[month]++;
    });

    // Format data for chart
    const chartData = monthNames.map((name, index) => ({
      month: name,
      registrations: monthlyData[index],
    }));

    return NextResponse.json({
      success: true,
      message: 'Registrations per month retrieved successfully',
      data: {
        year,
        chart_data: chartData,
        total: registrations?.length || 0,
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