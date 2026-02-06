'use client';

import { useState, useEffect } from 'react';
import { Button, Badge, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { formatDateTime } from '@/lib/utils';

const roleColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'danger'> = {
  customer: 'info',
  admin: 'warning',
  driver: 'success',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = (supabase.from('profiles') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('role', filter);
      }

      const { data, error } = await query;

      if (data && !error) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Users</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
          <option value="driver">Drivers</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : users.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No users found</p>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.full_name}</p>
                    {user.avatar_url && (
                      <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full mt-1" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{user.email || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{user.phone || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={roleColors[user.role] || 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{formatDateTime(user.created_at)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="driver">Driver</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
