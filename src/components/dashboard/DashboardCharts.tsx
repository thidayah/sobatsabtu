'use client';

import { Icon } from '@iconify/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

export interface MemberChartData {
  year: number;
  chart_data: { month: string; new_members: number }[];
  total_new_members: number;
  average_per_month: number;
  highest_month: {
    month: string;
    count: number;
  };
}

export interface EventsChartData {
  year: number;
  chart_data: { month: string; quota: number; participants: number; attended: number }[];
  total_events: number;
  total_quota: number;
  total_participants: number;
  total_attended: number;
}

interface DashboardChartsProps {
  chartLoading: boolean;
  membersChart: MemberChartData | null;
  eventsChart: EventsChartData | null;
  filterYear: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: p.color }}>
            Total: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({ chartLoading, membersChart, eventsChart, filterYear }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart - New Members per Month */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Members Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monthly new member trends for {filterYear}
            </p>
          </div>
          <Icon icon="lucide:bar-chart-3" width="20" height="20" className="text-gray-400" />
        </div>
        <div className="h-80">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : membersChart && membersChart.chart_data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={membersChart.chart_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="new_members" fill="#2a7fff" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="new_members"
                    position="inside"
                    fill="#ffffff"
                    fontSize={12}
                    fontWeight={500}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No new member data available
              </p>
            </div>
          )}
        </div>
        {membersChart && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Member</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {membersChart.total_new_members.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average Per Month</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {membersChart.average_per_month.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bar Chart - Registrations per Month */}
      {/* <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Registrations Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monthly registration trends for {filterYear}
            </p>
          </div>
          <Icon icon="lucide:bar-chart-3" width="20" height="20" className="text-gray-400" />
        </div>
        <div className="h-80">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : registrationChart && registrationChart.chart_data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationChart.chart_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="registrations" fill="#0928d5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No registration data available
              </p>
            </div>
          )}
        </div>
        {registrationChart && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total registrations in {filterYear}:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {registrationChart.total}
              </span>
            </p>
          </div>
        )}
      </div> */}

      {/* Line Chart - Events Performance */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Events Performance
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monthly breakdown of quota, registered participants, and actual attendance for {filterYear}
            </p>
          </div>
          <Icon icon="lucide:trending-up" width="20" height="20" className="text-gray-400" />
        </div>
        <div className="h-80">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : eventsChart && eventsChart.chart_data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eventsChart.chart_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="quota"
                  name="Quota"
                  stroke="#bedbff"
                  strokeWidth={2}
                  dot={{ fill: '#bedbff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="participants"
                  name="Participants"
                  stroke="#2a7fff"
                  strokeWidth={2}
                  dot={{ fill: '#2a7fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="attended"
                  name="Attended"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ fill: '#16a34a', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No event data available
              </p>
            </div>
          )}
        </div>
        {eventsChart && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {eventsChart.total_events}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Quota</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {eventsChart.total_quota.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Participants</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {eventsChart.total_participants.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Attended</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {eventsChart.total_attended?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
