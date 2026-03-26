'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { saveAuth, isAuthenticated } from '@/lib/auth';
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
    setTimeout(() => setIsChecking(false), 500);    
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        saveAuth(result.data.user);
        router.push('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className=" bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50 dark:bg-gray-950">
          <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
          <p>Checking authentication ...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="min-h-svh flex items-center justify-center ">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}