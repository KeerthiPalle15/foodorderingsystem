'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import toast from 'react-hot-toast';

type Coupon = Database['public']['Tables']['coupons']['Row'];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await (supabase.from('coupons') as any)
        .select('*')
        .order('created_at', { ascending: false });

      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (couponId: string, currentStatus: boolean) => {
    try {
      await (supabase.from('coupons') as any)
        .update({ is_active: !currentStatus })
        .eq('id', couponId);

      setCoupons(coupons.map(c => 
        c.id === couponId ? { ...c, is_active: !c.is_active } : c
      ));
      
      toast.success('Updated');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-56 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <Button onClick={() => setShowModal(true)}>Add New Coupon</Button>
      </div>

      {coupons.length === 0 ? (
        <Card className="p-8 text-center">
          <span className="text-6xl mb-4 block">🎫</span>
          <p className="text-gray-500 mb-4">No coupons found</p>
          <Button onClick={() => setShowModal(true)}>Add First Coupon</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{coupon.code}</h3>
                    <Badge variant={coupon.is_active ? 'success' : 'default'}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
                <p className="text-3xl font-bold text-orange-500">
                  {coupon.type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)}
                </p>
                <p className="text-sm text-gray-500">off</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Min. Order</span>
                  <span className="text-gray-900">{formatCurrency(coupon.minimum_order)}</span>
                </div>
                {coupon.maximum_discount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max. Discount</span>
                    <span className="text-gray-900">{formatCurrency(coupon.maximum_discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Used</span>
                  <span className="text-gray-900">{coupon.used_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valid Until</span>
                  <span className="text-gray-900">{formatDateTime(coupon.valid_until || '')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => toggleActive(coupon.id, coupon.is_active)} 
                  className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                >
                  {coupon.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Coupon</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const couponData = {
                code: formData.get('code') as string,
                description: formData.get('description') as string,
                type: formData.get('type') as 'percentage' | 'fixed',
                discount_value: parseFloat(formData.get('discount_value') as string),
                minimum_order: parseFloat(formData.get('minimum_order') as string) || 0,
                valid_until: formData.get('valid_until') as string,
                is_active: true,
              };
              
              await (supabase.from('coupons') as any).insert(couponData);
              fetchCoupons();
              setShowModal(false);
              toast.success('Coupon added');
            }}>
              <input name="code" type="text" placeholder="Coupon Code" className="w-full px-3 py-2 border border-gray-300 rounded-lg uppercase focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              <textarea name="description" placeholder="Description" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" rows={2} />
              <div className="grid grid-cols-2 gap-4">
                <select name="type" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
                <input name="discount_value" type="number" step="0.01" placeholder="Discount Value" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <input name="minimum_order" type="number" step="0.01" placeholder="Minimum Order" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input name="valid_until" type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
