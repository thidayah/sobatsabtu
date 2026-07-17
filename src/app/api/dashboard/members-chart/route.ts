import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { supabaseServer } from '@/lib/supabase';

const getMembersChartData = unstable_cache(
  async (year: number) => {
    // Get date range for the specified year
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // Get all members created in the specified year
    const { data: members, error } = await supabaseServer
      .from('ss_members')
      .select('created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      throw new Error(error.message);
    }

    // Initialize months array (Jan = 0, Dec = 11)
    const monthlyData = Array(12).fill(0);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Count members per month
    members?.forEach(member => {
      const month = new Date(member.created_at).getMonth();
      monthlyData[month]++;
    });

    // Format data for chart
    const chartData = monthNames.map((name, index) => ({
      month: name,
      new_members: monthlyData[index],
    }));

    // Calculate total new members for the year
    const totalNewMembers = monthlyData.reduce((a, b) => a + b, 0);

    // Calculate average new members per month
    const averageNewMembers = totalNewMembers / 12;

    // Find month with highest new members
    let maxMonthIndex = 0;
    let maxMonthValue = 0;
    monthlyData.forEach((value, index) => {
      if (value > maxMonthValue) {
        maxMonthValue = value;
        maxMonthIndex = index;
      }
    });

    return {
      year,
      chart_data: chartData,
      total_new_members: totalNewMembers,
      average_per_month: Math.round(averageNewMembers * 10) / 10,
      highest_month: {
        month: monthNames[maxMonthIndex],
        count: maxMonthValue,
      },
    };
  },
  ['dashboard-members-chart'],
  { revalidate: 300 }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const data = await getMembersChartData(year);

    return NextResponse.json({
      success: true,
      message: 'Members chart data retrieved successfully',
      data,
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