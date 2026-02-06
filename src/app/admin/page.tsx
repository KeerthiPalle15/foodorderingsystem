'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string | null;
  total_amount: number;
  status: string;
  order_date: string;
}

interface TopFood {
  id: string;
  name: string;
  orders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topFoods, setTopFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch total revenue and order count
      const { data: orders } = await (supabase.from('orders') as any)
        .select('total_amount, status');

      if (orders) {
        const completedOrders = orders.filter((o: any) => 
          ['delivered', 'out_for_delivery', 'ready'].includes(o.status)
        );
        const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers: 0, // Will be fetched separately
          avgOrderValue,
        });
      }

      // Fetch recent orders
      const { data: recentData } = await (supabase.from('orders') as any)
        .select('*')
        .order('order_date', { ascending: false })
        .limit(5);

      if (recentData) {
        setRecentOrders(recentData);
      }

      // Fetch total customers
      const { count: customerCount } = await (supabase.from('profiles') as any)
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      setStats(prev => ({ ...prev, totalCustomers: customerCount || 0 }));

      // Fetch top selling foods (simplified - counts order items)
      const { data: orderItems } = await (supabase.from('order_items') as any)
        .select('food_item_id, quantity, price, food_items(name)');

      if (orderItems) {
        const foodSales: Record<string, { name: string; orders: number; revenue: number }> = {};
        
        orderItems.forEach((item: any) => {
          const foodId = item.food_item_id;
          const itemTotal = (item.price || 0) * (item.quantity || 1);
          
          if (!foodSales[foodId]) {
            foodSales[foodId] = {
              name: item.food_items?.name || 'Unknown',
              orders: 0,
              revenue: 0,
            };
          }
          foodSales[foodId].orders += item.quantity || 1;
          foodSales[foodId].revenue += itemTotal;
        });

        const topFoodsData = Object.entries(foodSales)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 4);

        setTopFoods(topFoodsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <span className="text-3xl">📦</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalCustomers}
              </p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.avgOrderValue)}
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-3 font-medium text-gray-900">
                        #{order.order_number}
                      </td>
                      <td className="py-3 text-gray-600">
                        {order.customer_name || 'Customer'}
                      </td>
                      <td className="py-3 text-gray-600">
                        {formatCurrency(order.total_amount || 0)}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        {/* Top Foods */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Foods</h2>
          {topFoods.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No food data yet</p>
          ) : (
            <div className="space-y-4">
              {topFoods.map((food, index) => (
                <div key={food.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{food.name}</p>
                      <p className="text-sm text-gray-500">{food.orders} orders</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(food.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
