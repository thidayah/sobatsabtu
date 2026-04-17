'use client';

import { useEffect, useState } from 'react';
import { getAuth } from '@/lib/auth';
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
} from 'recharts';

interface DashboardStats {
  total_members: number;
  total_events: number;
  total_registrations: number;
  active_events: number;
}

interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  current_participants: number;
  max_participants: number;
  is_active: boolean;
}

interface RegistrationChartData {
  year: number;
  chart_data: { month: string; registrations: number }[];
  total: number;
}

interface EventsChartData {
  year: number;
  chart_data: { month: string; quota: number; participants: number }[];
  total_events: number;
  total_quota: number;
  total_participants: number;
}

interface PopularEvent {
  id: string;
  name: string;
  slug: string;
  date: string;
  max_participants: number;
  current_participants: number;
  total_registrations: number;
  fill_rate: number;
}

interface ActiveMember {
  member_id: string;
  full_name: string;
  email: string;
  ig_username: string;
  total_events: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [registrationChart, setRegistrationChart] = useState<RegistrationChartData | null>(null);
  const [eventsChart, setEventsChart] = useState<EventsChartData | null>(null);
  const [popularEvents, setPopularEvents] = useState<PopularEvent[]>([]);
  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: '', label: 'Full Year' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  useEffect(() => {
    const auth = getAuth();
    setUser(auth ? { name: auth.name } : null);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setEventsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `/api/events?is_active=true&sort_by=date&sort_order=asc&limit=3&date_gte=${today}`
        );
        const result = await response.json();
        if (result.success) {
          setUpcomingEvents(result.data.items || []);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const fetchCharts = async () => {
      setChartLoading(true);
      try {
        // Fetch registration chart
        const regResponse = await fetch(`/api/dashboard/registrations-chart?year=${filterYear}`);
        const regResult = await regResponse.json();
        if (regResult.success) {
          setRegistrationChart(regResult.data);
        }

        // Fetch events chart
        const eventsResponse = await fetch(`/api/dashboard/events-chart?year=${filterYear}`);
        const eventsResult = await eventsResponse.json();
        if (eventsResult.success) {
          setEventsChart(eventsResult.data);
        }

        // Fetch popular events
        const popularParams = new URLSearchParams({
          year: filterYear.toString(),
          limit: '5',
        });
        if (filterMonth) {
          popularParams.set('month', `${filterYear}-${filterMonth}`);
        }
        const popularResponse = await fetch(`/api/dashboard/popular-events?${popularParams}`);
        const popularResult = await popularResponse.json();
        if (popularResult.success) {
          setPopularEvents(popularResult.data);
        }

        // Fetch active members
        const membersParams = new URLSearchParams({
          year: filterYear.toString(),
          limit: '5',
        });
        if (filterMonth) {
          membersParams.set('month', `${filterYear}-${filterMonth}`);
        }
        const membersResponse = await fetch(`/api/dashboard/active-members?${membersParams}`);
        const membersResult = await membersResponse.json();
        if (membersResult.success) {
          setActiveMembers(membersResult.data);
        }
      } catch (error) {
        console.error('Error fetching charts:', error);
      } finally {
        setChartLoading(false);
      }
    };

    fetchCharts();
  }, [filterYear, filterMonth]);

  const statCards = [
    {
      title: 'Total Members',
      value: stats?.total_members || 0,
      icon: 'lucide:users',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Events',
      value: stats?.total_events || 0,
      icon: 'lucide:calendar',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Registrations',
      value: stats?.total_registrations || 0,
      icon: 'lucide:clipboard-list',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Active Events',
      value: stats?.active_events || 0,
      icon: 'lucide:activity',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const getFillRateColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 80) return 'text-orange-600 dark:text-orange-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your community activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} border border-gray-200 dark:border-gray-800 p-6 transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-white dark:bg-gray-800 shadow-sm`}>
                <Icon icon={card.icon} width="24" height="24" className={card.iconColor} />
              </div>
              <div className="text-right">
                {loading ? (
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Events happening soon
              </p>
            </div>
            <Icon icon="lucide:calendar" width="20" height="20" className="text-gray-400" />
          </div>
          <div className="p-6">
            {eventsLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => {
                  const fillPercentage = (event.current_participants / event.max_participants) * 100;
                  const isAlmostFull = fillPercentage >= 80;
                  const isFull = fillPercentage == 100;

                  return (
                    <div
                      key={event.id}
                      className="border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {event.name}
                        </h3>
                        {/* {isAlmostFull && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 whitespace-nowrap ml-2">
                            Almost Full
                          </span>
                        )} */}
                        {isFull ? (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 whitespace-nowrap ml-2">
                            Full
                          </span>
                        ) : isAlmostFull ? (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 whitespace-nowrap ml-2">
                            Almost Full
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Icon icon="lucide:calendar" width="14" height="14" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Icon icon="lucide:clock" width="14" height="14" />
                          <span>{formatTime(event.time)} WIB</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Icon icon="lucide:map-pin" width="14" height="14" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Quota</span>
                          <span className={getFillRateColor(event.current_participants, event.max_participants)}>
                            {event.current_participants}/{event.max_participants}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-orange-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-700">
                <Icon icon="lucide:calendar-x" width="48" height="48" className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No upcoming events scheduled
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Create new events to see them here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year:</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sobat-blue"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Month:</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sobat-blue"
          >
            {months.map((month) => (
              <option key={month.value || 'all'} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Registrations per Month */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
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
        </div>

        {/* Line Chart - Events Performance */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Events Performance
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Quota vs Participants comparison for {filterYear}
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
                    name="Event Quota"
                    stroke="#fac202"
                    strokeWidth={2}
                    dot={{ fill: '#fac202', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="participants"
                    name="Registered Participants"
                    stroke="#0928d5"
                    strokeWidth={2}
                    dot={{ fill: '#0928d5', strokeWidth: 2 }}
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
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
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
            </div>
          )}
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Events */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Most Popular Events
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Based on registration count
              </p>
            </div>
            <Icon icon="lucide:trophy" width="20" height="20" className="text-yellow-500" />
          </div>
          <div className="p-6">
            {chartLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : popularEvents.length > 0 ? (
              <div className="space-y-4">
                {popularEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : index === 1
                          ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          : index === 2
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{event.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString()} • {event.fill_rate.toFixed(0)}% filled
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {event.total_registrations}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">registrations</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No event data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Most Active Members
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Based on event participation
              </p>
            </div>
            <Icon icon="lucide:award" width="20" height="20" className="text-sobat-blue" />
          </div>
          <div className="p-6">
            {chartLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : activeMembers.length > 0 ? (
              <div className="space-y-4">
                {activeMembers.map((member, index) => (
                  <div
                    key={member.member_id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sobat-blue to-blue-600 flex items-center justify-center text-white font-bold">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.full_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.ig_username ? `@${member.ig_username}` : member.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {member.total_events}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">events joined</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No member activity data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}