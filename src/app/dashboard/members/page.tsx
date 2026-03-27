'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from "@/lib/helpers";
import { Select } from "@/components/ui/Select";

interface Member {
  id: string;
  full_name: string;
  email: string;
  ig_username: string;
  gender: string;
  is_active: boolean;
  total_events: number;
  created_at: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
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
    is_active: '',
    start_date: '',
    end_date: '',
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.is_active && { is_active: filters.is_active }),
        ...(filters.start_date && { start_date: filters.start_date }),
        ...(filters.end_date && { end_date: filters.end_date }),
      });

      const response = await fetch(`/api/members?${params}`);
      const result = await response.json();

      if (result.success) {
        setMembers(result.data.items || []);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [pagination.page, filters.is_active, filters.start_date, filters.end_date]);

  const handleSearch = () => {
    if (loading) return
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchMembers();
  };

  const debouncedSearch = useDebounce(filters.search, 500); // 500ms delay

  useEffect(() => handleSearch(), [debouncedSearch]);

  const columns = [
    {
      key: 'member',
      header: 'Name',
      render: (item: Member) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.full_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.gender}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email & Instagram',
      render: (item: Member) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.email}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.ig_username ? `@${item.ig_username}` : '-'}</p>
        </div>
      ),
    },
    { key: 'total_events', header: 'Events Joined' },
    {
      key: 'is_active',
      header: 'Status',
      render: (item: Member) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Registered',
      render: (item: Member) => new Date(item.created_at).toLocaleDateString(),
    },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Members</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name, email, or IG..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          // onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Select
            options={statusOptions}
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
          />
          <Input
            type="date"
            placeholder="Start Date"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
          />
          <Input
            type="date"
            placeholder="End Date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSearch} icon="lucide:search">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <Table
          columns={columns}
          data={members}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {members.length} of {pagination.total} members
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
    </div>
  );
}