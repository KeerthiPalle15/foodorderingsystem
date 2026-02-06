'use client';

import { useState, useEffect } from 'react';
import { Button, Badge, Card, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    minimum_order: '',
    maximum_discount: '',
    usage_limit: '',
    valid_until: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase.from('coupons') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setCoupons(data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await (supabase.from('coupons') as any).insert({
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        type: formData.type,
        discount_value: parseFloat(formData.discount_value),
        minimum_order: formData.minimum_order ? parseFloat(formData.minimum_order) : 0,
        maximum_discount: formData.maximum_discount ? parseFloat(formData.maximum_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_until: formData.valid_until || null,
      });

      if (error) throw error;

      setShowForm(false);
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        discount_value: '',
        minimum_order: '',
        maximum_discount: '',
        usage_limit: '',
        valid_until: '',
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await (supabase as any).from('coupons').update({ is_active: !current }).eq('id', id);
      fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await (supabase as any).from('coupons').delete().eq('id', id);
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Coupon'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Coupon</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., SAVE20"
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <Input
              label="Discount Value"
              type="number"
              step="0.01"
              value={formData.discount_value}
              onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
              required
            />
            <Input
              label="Minimum Order"
              type="number"
              step="0.01"
              value={formData.minimum_order}
              onChange={(e) => setFormData({ ...formData, minimum_order: e.target.value })}
            />
            <Input
              label="Maximum Discount"
              type="number"
              step="0.01"
              value={formData.maximum_discount}
              onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value })}
            />
            <Input
              label="Usage Limit"
              type="number"
              value={formData.usage_limit}
              onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
            />
            <Input
              label="Valid Until"
              type="datetime-local"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">Create Coupon</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : coupons.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No coupons found</p>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Code</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Usage</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{coupon.code}</p>
                    <p className="text-sm text-gray-500">{coupon.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-orange-500">
                      {coupon.type === 'percentage' 
                        ? `${coupon.discount_value}%` 
                        : formatCurrency(coupon.discount_value)}
                    </p>
                    {coupon.minimum_order > 0 && (
                      <p className="text-sm text-gray-500">Min: {formatCurrency(coupon.minimum_order)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">
                      {coupon.used_count}
                      {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={coupon.is_active ? 'success' : 'danger'}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                      >
                        {coupon.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteCoupon(coupon.id)}
                      >
                        Delete
                      </Button>
                    </div>
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
