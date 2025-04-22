'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('admin-session') === 'authenticated';
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !pathname.includes('/login')) {
      router.push('/ephemeral-footsteps-h4w1/login');
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-black cursor-default">
      {/* Matrix-style background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.1)_0%,transparent_100%)] opacity-20" />
      <div className="fixed inset-0 bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[length:100%_4px] opacity-20" />
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 