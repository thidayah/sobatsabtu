import { formatDiff } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

interface Participant {
  id: string;
  member: {
    full_name: string;
    email: string;
    ig_username: string;
    gender: string;
  };
  code: string;
  status: string;
  created_at: string;
}

interface ParticipantsTableProps {
  id: string;
  slug: string;
  current_participants: number;
}

export const ParticipantsTable = ({ slug, current_participants }: ParticipantsTableProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next_page: false,
    has_prev_page: false
  });

  // Fetch participants data
  const fetchParticipants = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        slug: slug,
        ...(search && { search })
      });

      const response = await fetch(`/api/registrations?${params}`);
      const result = await response.json();

      if (result.success) {
        setParticipants(result.data.items || []);
        setPagination(result.data.pagination);
      } else {
        console.error("Failed to fetch participants:", result.message);
        setParticipants([]);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setParticipants([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchParticipants(1, "");
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps -- deps intentional (initial load on slug change)

  // Handle search
  const handleSearch = async () => {
    setSearchLoading(true);
    await fetchParticipants(1, searchQuery);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchParticipants(newPage, searchQuery);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Get start and end index for display
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="md:text-2xl font-bold">Participants ({current_participants})</h2>

        {/* Search and Export */}
        {participants.length > 0 && (
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Search participants"
                placeholder="Search participants…"
                className="w-full sm:w-80 px-4 py-2 pl-10 border border-ink-2 bg-paper focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-shadow text-sm md:text-base"
              />
              <Icon
                icon="lucide:search"
                width="18"
                height="18"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              aria-label="Search"
              disabled={searchLoading}
              className="px-6 py-2 bg-paper-3 text-ink-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm cursor-pointer justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? (
                <Icon icon="lucide:loader-2" width="18" height="18" className="animate-spin" />
              ) : (
                <Icon icon="lucide:search" width="18" height="18" className="md:hidden" />
              )}
              <span className="hidden sm:inline">{searchLoading ? "Searching…" : "Search"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent animate-spin" />
        </div>
      ) : participants.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-paper-2">
          {/* <Icon icon="lucide:users" width="48" height="48" className="mx-auto text-gray-400 mb-4" /> */}
          <h3 className="text-lg font-semibold text-ink-2 mb-2">
            No participants found
          </h3>
          <p className="text-sm text-muted">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "Be the first to register for this event!"}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchParticipants(1, "");
                }}
                className="mt-4 text-sobat-blue dark:text-sobat-yellow hover:underline text-sm ml-3"
              >
                Clear search
              </button>
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Participants Table */}
          <div className="bg-paper mb-6 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-rule">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-semibold text-gray-900 dark:text-white w-16">No</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 min-w-48 text-left text-sm font-semibold text-gray-900 dark:text-white">Participant</th>
                    {/* <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Username</th> */}
                    <th className="px-4 md:px-6 py-3 md:py-4 min-w-40 text-left text-sm font-semibold text-gray-900 dark:text-white">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {participants.map((participant, index) => (
                    <tr key={participant.id} className=" border-b border-rule hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 md:px-6 py-3 text-sm text-ink-2">
                        {startIndex + index}
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {participant.member.full_name}
                            </p>
                            <p className="text-xs text-muted">
                              {participant.member.gender === 'male' ? 'Male' : participant.member.gender === 'female' ? 'Female' : 'Other'}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* <td className="px-4 md:px-6 py-3 text-sm text-ink-2">
                        {participant.member.ig_username ? `@${participant.member.ig_username}` : '-'}
                      </td> */}
                      <td className="px-4 md:px-6 py-3">
                        <div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {participant.status === 'confirmed' ? 'Confirmed' : participant.status}
                          </span>
                          <p className="text-xs text-muted mt-1">
                            {formatDiff(participant.created_at)}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs md:text-sm text-muted">
                Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> participants
              </p>

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  aria-label="Previous page"
                  disabled={!pagination.has_prev_page}
                  className="w-7 h-7 md:w-10 md:h-10 border border-rule flex items-center justify-center text-ink-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="lucide:chevron-left" width="18" height="18" />
                </button>

                {/* Page Numbers */}
                {(() => {
                  const pages = [];
                  const totalPages = pagination.total_pages;
                  const currentPage = pagination.page;

                  // Always show first page
                  pages.push(1);

                  // Show ellipsis if current page > 3
                  if (currentPage > 3) {
                    pages.push('...');
                  }

                  // Show pages around current page
                  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    if (!pages.includes(i)) {
                      pages.push(i);
                    }
                  }

                  // Show ellipsis if current page < totalPages - 2
                  if (currentPage < totalPages - 2) {
                    pages.push('...');
                  }

                  // Always show last page if totalPages > 1
                  if (totalPages > 1 && !pages.includes(totalPages)) {
                    pages.push(totalPages);
                  }

                  return pages.map((page, idx) => (
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-gray-500">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        aria-current={pagination.page === page ? "page" : undefined}
                        className={`w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-sm font-medium transition-colors ${pagination.page === page
                          ? 'bg-sobat-blue text-white'
                          : 'border border-rule text-ink-2 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        {page}
                      </button>
                    )
                  ));
                })()}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  aria-label="Next page"
                  disabled={!pagination.has_next_page}
                  className="w-7 h-7 md:w-10 md:h-10 border border-rule flex items-center justify-center text-ink-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="lucide:chevron-right" width="18" height="18" />
                </button>
              </div>
            </div>
          )}

          {/* Export Options Modal (hidden by default) */}
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
            <div className="bg-paper p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Export Participants</h3>
              <p className="text-muted mb-6">
                Choose your preferred format to export the participants list.
              </p>
              <div className="space-y-3 mb-6">
                <button className="w-full p-4 border border-rule hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:file-text" width="20" height="20" className="text-sobat-blue" />
                    <div>
                      <p className="font-medium">CSV File</p>
                      <p className="text-sm text-gray-500">Compatible with Excel, Google Sheets</p>
                    </div>
                  </div>
                  <Icon icon="lucide:chevron-right" width="20" height="20" className="text-gray-400" />
                </button>
                <button className="w-full p-4 border border-rule hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:file-spreadsheet" width="20" height="20" className="text-green-600" />
                    <div>
                      <p className="font-medium">Excel File</p>
                      <p className="text-sm text-gray-500">.xlsx format with formatting</p>
                    </div>
                  </div>
                  <Icon icon="lucide:chevron-right" width="20" height="20" className="text-gray-400" />
                </button>
                <button className="w-full p-4 border border-rule hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:file-text" width="20" height="20" className="text-red-600" />
                    <div>
                      <p className="font-medium">PDF Document</p>
                      <p className="text-sm text-gray-500">Printable format with table styling</p>
                    </div>
                  </div>
                  <Icon icon="lucide:chevron-right" width="20" height="20" className="text-gray-400" />
                </button>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-3 py-2 border border-rule font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button className="flex-1 px-3 py-2 bg-sobat-blue text-white font-medium hover:bg-blue-600 transition-colors">
                  Export
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};