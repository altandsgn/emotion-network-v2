'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin-session', 'authenticated');
        router.push('/ephemeral-footsteps-h4w1/dashboard');
      } else {
        setError(data.message || 'Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cursor-default">
      <div className="w-full max-w-md">
        <div className="border border-green-500/50 rounded-lg bg-black/80 p-8 backdrop-blur-sm">
          <h1 className="text-green-500 font-mono text-2xl mb-8 text-center">
            System Access Required
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-green-500/50 rounded px-3 py-2 text-green-500 font-mono focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 cursor-text"
                  placeholder="Enter access key"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              {error && (
                <p className="mt-2 text-red-500 font-mono text-sm">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500/10 border border-green-500/50 text-green-500 py-2 rounded font-mono hover:bg-green-500/20 hover:border-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Access System'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 