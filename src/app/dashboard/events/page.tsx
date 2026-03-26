'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { EventModal } from './EventModal';

interface Event {
  id: string;
  name: string;
  descriptions: string;
  slug: string;
  image_url: string;
  date: string;
  time: string;
  location: string;
  current_participants: number;
  max_participants: number;
  type: string;
  is_active: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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
    is_active: '',
    sort_by: 'date',
    sort_order: 'desc',
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.is_active && { is_active: filters.is_active }),
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });

      const response = await fetch(`/api/events?${params}`);
      const result = await response.json();

      if (result.success) {
        setEvents(result.data.items || []);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, filters]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (result.success) {
        fetchEvents();
      } else {
        alert(result.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const columns = [
    { key: 'name', header: 'Event Name' },
    {
      key: 'date',
      header: 'Date',
      render: (item: Event) => new Date(item.date).toLocaleDateString(),
    },
    { key: 'time', header: 'Time', render: (item: Event) => item.time.substring(0, 5) },
    { key: 'location', header: 'Location', className: 'max-w-xs truncate' },
    {
      key: 'participants',
      header: 'Participants',
      render: (item: Event) => `${item.current_participants}/${item.max_participants}`,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (item: Event) => (
        <span className={`px-2 py-1 text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Event) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingEvent(item);
              setModalOpen(true);
            }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Icon icon="lucide:edit" width="18" height="18" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Icon icon="lucide:trash-2" width="18" height="18" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
        <Button onClick={() => {
          setEditingEvent(null);
          setModalOpen(true);
        }} icon="lucide:plus">
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && fetchEvents()}
          />
          <select
            className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sobat-blue"
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sobat-blue"
            value={filters.sort_by}
            onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Created</option>
          </select>
          <select
            className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sobat-blue"
            value={filters.sort_order}
            onChange={(e) => setFilters({ ...filters, sort_order: e.target.value })}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={fetchEvents} icon="lucide:search">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <Table
          columns={columns}
          data={events}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {events.length} of {pagination.total} events
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

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSuccess={fetchEvents}
      />
    </div>
  );
}