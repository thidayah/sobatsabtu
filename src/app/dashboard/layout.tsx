'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Navbar } from '@/components/layout/Navbar';
import { getAuth, isAuthenticated, clearAuth } from '@/lib/auth';

const menuItems = [
  { href: '/dashboard', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
  { href: '/dashboard/members', icon: 'lucide:users', label: 'Members' },
  { href: '/dashboard/events', icon: 'lucide:calendar', label: 'Events' },
  { href: '/dashboard/registrations', icon: 'lucide:clipboard-list', label: 'Registrations' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  useEffect(() => {
    // Check authentication on client-side only
    const authenticated = isAuthenticated();
    
    setIsAuthenticatedState(authenticated);
    
    if (!authenticated) {
      router.push('/admin');
    } else {
      const auth = getAuth();
      setUser(auth ? { name: auth.name } : null);
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticatedState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <div className="flex pt-28 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-36 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="flex flex-col h-[90%]">
            <div className="p-4 border-b border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sobat-blue to-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                {isSidebarOpen && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                  </div>
                )}
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    pathname === item.href
                      ? 'bg-sobat-blue/10 text-sobat-blue dark:bg-sobat-yellow/10 dark:text-sobat-yellow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon icon={item.icon} width="20" height="20" />
                  {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:log-out" width="20" height="20" />
                {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed mt-22 z-20 size-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
          style={{ 
            left: isSidebarOpen ? 'calc(16rem - 12px)' : 'calc(5rem - 12px)',
            top: 'calc(4rem + 12px)'
          }}
        >
          <Icon
            icon={isSidebarOpen ? 'lucide:chevron-left' : 'lucide:chevron-right'}
            width="12"
            height="12"
          />
        </button>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className="p-6 pb-40">
            {children}
          </div>
        </main>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
}