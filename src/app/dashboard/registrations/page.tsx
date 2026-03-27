'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate, formatDiff } from "@/lib/utils";
import { Select } from "@/components/ui/Select";
import { useDebounce } from "@/lib/helpers";

interface Registration {
  id: string;
  code: string;
  status: string;
  created_at: string;
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
  };
  member: {
    id: string;
    full_name: string;
    email: string;
    ig_username: string;
    gender: string;
  };
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next_page: false,
    has_prev_page: false,
  });
  const [filters, setFilters] = useState({
    search: '',
    event_id: '',
    status: '',
  });
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  // Fetch events for filter dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=25&sort_by=date');
        const result = await response.json();
        if (result.success) {
          setEvents(result.data.items || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.event_id && { event_id: filters.event_id }),
        ...(filters.status && { status: filters.status }),
      });

      const response = await fetch(`/api/registrations?${params}`);
      const result = await response.json();

      if (result.success) {
        setRegistrations(result.data.items || []);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [pagination.page, filters.event_id, filters.status, pagination.limit]);

  const handleSearch = () => {
    if (loading) return
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchRegistrations();
  };

  const debouncedSearch = useDebounce(filters.search, 500); // 500ms delay

  // useEffect(() => handleSearch(), [debouncedSearch]);

  const handleReset = () => {
    setFilters({
      search: '',
      event_id: '',
      status: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => fetchRegistrations(), 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      confirmed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
      cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
      waiting: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: 'code',
      header: 'Registration Code',
      render: (item: Registration) => (
        <span className="font-mono text-sm">{item.code}</span>
      ),
    },
    {
      key: 'member',
      header: 'Participant',
      render: (item: Registration) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.member.full_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.member.email}</p>
        </div>
      ),
    },
    {
      key: 'event',
      header: 'Event',
      render: (item: Registration) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.event.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.event.location}</p>
        </div>
      ),
    },
    {
      key: 'event_date',
      header: 'Event Date',
      render: (item: Registration) => (
        <div>
          <p className="text-sm">{formatDate(item.event.date)}</p>
        </div>
      ),
    },
    {
      key: 'registered_at',
      header: 'Registered',
      render: (item: Registration) => (
        <div>
          <span>{getStatusBadge(item.status)}</span>
          <p className="text-sm mt-1">{formatDiff(item.created_at)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Registration) => (
        <button
          onClick={() => {
            setSelectedRegistration(item);
            setShowDetailModal(true);
          }}
          className="p-1 text-sobat-blue hover:text-blue-700 dark:text-sobat-yellow dark:hover:text-yellow-500"
        >
          <Icon icon="lucide:eye" width="18" height="18" />
        </button>
      ),
    },
  ];

  const statusOptions = ['', 'Confirmed', 'Pending', 'Cancelled', 'Waiting']

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registrations</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name, email, or code..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Select
            options={
              [
                { value: '', label: 'All Events' },
                ...events.map((row) => ({
                  ...row,
                  value: row.id,
                  label: row.name,
                }))
              ]
            }
            value={filters.event_id}
            onChange={(e) => setFilters({ ...filters, event_id: e.target.value })}
          />
          <Select
            options={statusOptions.map((row) => ({
              value: row.toLowerCase(),
              label: row === '' ? 'All Status' : row
            }))}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />

          <Select
            options={[10, 20, 50, 100].map((row) => ({
              value: row.toString(),
              label: row.toString()
            }))}
            value={pagination.limit}
            onChange={(e) => setPagination({ ...pagination, limit: parseInt(e.target.value) })}
          />

        </div>
        <div className=" mt-4 flex justify-end  gap-3">
          <Button onClick={handleReset} variant="outline" icon="lucide:refresh-ccw">
            Reset
          </Button>
          <Button onClick={handleSearch} icon="lucide:search">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <Table
          columns={columns}
          data={registrations}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {registrations.length} of {pagination.total} registrations
        </p>
        <Pagination
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          totalPages={pagination.total_pages}
          hasNextPage={pagination.has_next_page}
          hasPrevPage={pagination.has_prev_page}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Registration Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Icon icon="lucide:x" width="20" height="20" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Registration Code</p>
                  <p className="text-sm font-mono font-medium">{selectedRegistration.code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  {getStatusBadge(selectedRegistration.status)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Participant Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                    <p className="text-sm">{selectedRegistration.member.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-sm">{selectedRegistration.member.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Instagram</p>
                    <p className="text-sm">{selectedRegistration.member.ig_username ? `@${selectedRegistration.member.ig_username}` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gender</p>
                    <p className="text-sm capitalize">{selectedRegistration.member.gender || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Event Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Event Name</p>
                    <p className="text-sm font-medium">{selectedRegistration.event.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Event Date</p>
                    <p className="text-sm">{new Date(selectedRegistration.event.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                    <p className="text-sm">{selectedRegistration.event.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Registered At</p>
                    <p className="text-sm">{new Date(selectedRegistration.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-800">
              <Button onClick={() => setShowDetailModal(false)} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}