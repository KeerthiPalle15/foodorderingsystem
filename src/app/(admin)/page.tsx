'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_id: string;
  delivery_address: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
}

interface TopFood {
  id: string;
  name: string;
  order_count: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topFoods, setTopFoods] = useState<TopFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await (supabase.from('orders') as any)
        .select('id, total, status, payment_status, created_at, user_id')
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw new Error(ordersError.message);
      }

      // Fetch profiles count
      const { count: totalCustomers, error: customersError } = await (supabase.from('profiles') as any)
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      if (customersError) {
        console.warn('Error fetching customers:', customersError);
      }

      // Calculate stats from orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrdersData = orders?.filter((o: any) => new Date(o.created_at) >= today) || [];
      
      const completedOrdersData = orders?.filter((o: any) => 
        ['delivered', 'completed'].includes(o.status)
      ) || [];

      const pendingOrdersData = orders?.filter((o: any) => 
        ['pending', 'confirmed', 'preparing'].includes(o.status)
      ) || [];

      const totalRevenue = completedOrdersData.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const todayRevenue = todayOrdersData.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalCustomers: totalCustomers || 0,
        pendingOrders: pendingOrdersData.length,
        completedOrders: completedOrdersData.length,
        todayOrders: todayOrdersData.length,
        todayRevenue,
      });

      setRecentOrders(orders?.slice(0, 10) || []);

      // Fetch top selling foods from order_items
      const { data: orderItems, error: itemsError } = await (supabase.from('order_items') as any)
        .select('food_item_id, quantity, unit_price, subtotal, food_items(name)')
        .order('created_at', { ascending: false });

      if (itemsError) {
        console.warn('Error fetching order items:', itemsError);
      }

      // Calculate top foods
      if (orderItems && orderItems.length > 0) {
        const foodSales: Record<string, { name: string; order_count: number; revenue: number }> = {};
        
        orderItems.forEach((item: any) => {
          const foodId = item.food_item_id;
          const itemTotal = (item.subtotal || (item.unit_price * item.quantity)) || 0;
          
          if (!foodSales[foodId]) {
            foodSales[foodId] = {
              name: item.food_items?.name || 'Unknown',
              order_count: 0,
              revenue: 0,
            };
          }
          foodSales[foodId].order_count += item.quantity || 1;
          foodSales[foodId].revenue += itemTotal;
        });

        const topFoodsData = Object.entries(foodSales)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.order_count - a.order_count)
          .slice(0, 5);

        setTopFoods(topFoodsData);
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">⚠️</span>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
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
              <p className="text-xs text-green-600 mt-1">
                +{formatCurrency(stats.todayRevenue)} today
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.todayOrders} orders today
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
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">
                {stats.pendingOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.completedOrders} completed
              </p>
            </div>
            <span className="text-3xl">⏳</span>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All →
            </a>
          </div>
          
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-3 font-medium text-gray-900">
                        #{order.order_number}
                      </td>
                      <td className="py-3 text-gray-600">
                        {formatCurrency(order.total || 0)}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        {order.delivery_latitude && order.delivery_longitude ? (
                          <a 
                            href={`https://www.openstreetmap.org/?mlat=${order.delivery_latitude}&mlon=${order.delivery_longitude}&zoom=17`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700"
                            title={order.delivery_address}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-500">
                        {formatDateTime(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Top Selling Foods */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Foods</h2>
            <a href="/admin/foods" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All →
            </a>
          </div>
          
          {topFoods.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No food data yet</p>
          ) : (
            <div className="space-y-4">
              {topFoods.map((food, index) => (
                <div key={food.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{food.name}</p>
                      <p className="text-sm text-gray-500">{food.order_count} orders</p>
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

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/orders" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 p-2 hover:bg-orange-50 rounded-lg transition-colors">
              <span>📦</span> View all orders
            </a>
            <a href="/admin/foods" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 p-2 hover:bg-orange-50 rounded-lg transition-colors">
              <span>🍔</span> Manage menu items
            </a>
            <a href="/admin/coupons" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 p-2 hover:bg-orange-50 rounded-lg transition-colors">
              <span>🎫</span> Create coupons
            </a>
            <a href="/admin/categories" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 p-2 hover:bg-orange-50 rounded-lg transition-colors">
              <span>📁</span> Manage categories
            </a>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Orders Today</span>
              <span className="font-medium">{stats.todayOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Today</span>
              <span className="font-medium">{formatCurrency(stats.todayRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium text-orange-500">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-green-500">{stats.completedOrders}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span> Pending
              </span>
              <span className="font-medium">{recentOrders.filter(o => o.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-3 h-3 bg-blue-400 rounded-full"></span> Confirmed
              </span>
              <span className="font-medium">{recentOrders.filter(o => o.status === 'confirmed').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-3 h-3 bg-orange-400 rounded-full"></span> Preparing
              </span>
              <span className="font-medium">{recentOrders.filter(o => o.status === 'preparing').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span> Delivered
              </span>
              <span className="font-medium">{recentOrders.filter(o => o.status === 'delivered').length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
