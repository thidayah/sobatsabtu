'use client';

import { useEffect, useState } from 'react';
import { getAuth } from '@/lib/auth';
import DashboardLayout from "./layout";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth ? { name: auth.name } : null);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome back, {user?.name || 'Admin'}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is your dashboard. Use the sidebar to manage members and events.
      </p>
    </div>
  );
}