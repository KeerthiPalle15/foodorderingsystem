'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Check user role with explicit typing
      const { data: profileData } = await (supabase.from('profiles') as any)
        .select('role, email')
        .eq('id', session.user.id)
        .single();

      const profile = profileData as { role: string; email: string } | null;

      if (!profile || profile.role !== 'admin') {
        // Non-admin users can't access admin dashboard
        toast.error('Access denied. Admin only.');
        router.push('/menu');
        return;
      }

      setUserRole(profile.role);
      setUserEmail(profile.email || '');
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin" style={{ borderBottomColor: '#f97316' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🍔</span>
            </div>
          </div>
          <p className="mt-4 text-gray-500">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userEmail}</span>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userEmail ? userEmail[0].toUpperCase() : 'A'}
              </span>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
