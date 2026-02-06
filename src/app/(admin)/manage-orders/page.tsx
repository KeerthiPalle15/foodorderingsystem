'use client';

import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'danger'> = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'info',
  ready: 'success',
  out_for_delivery: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (data && !error) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (order: Order) => {
    setSelectedOrder(order);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (data && !error) {
        setOrderItems(data);
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await (supabase.from('orders') as any)
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: status });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Orders</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders found</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => fetchOrderItems(order)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id
                      ? 'bg-orange-50 border border-orange-500'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      Order #{order.order_number}
                    </span>
                    <Badge color={statusColors[order.status] || 'default'}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{order.customer_name}</p>
                    <p>{order.customer_phone}</p>
                    <p>{formatDateTime(order.order_date)}</p>
                    <p className="text-orange-600 font-semibold mt-1">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
          
          {selectedOrder ? (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Order #{selectedOrder.order_number}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge color={statusColors[selectedOrder.status] || 'default'}>
                    {selectedOrder.status}
                  </Badge>
                  <span className="text-gray-500">
                    {formatDateTime(selectedOrder.order_date)}
                  </span>
                </div>
                
                {/* Status Update Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Info</h4>
                <p className="text-gray-900">{selectedOrder.customer_name}</p>
                <p className="text-gray-600">{selectedOrder.customer_email}</p>
                <p className="text-gray-600">{selectedOrder.customer_phone}</p>
                <p className="text-gray-600 mt-2">{selectedOrder.delivery_address}</p>
                {selectedOrder.delivery_latitude && selectedOrder.delivery_longitude && (
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${selectedOrder.delivery_latitude}&mlon=${selectedOrder.delivery_longitude}&zoom=17`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    View on Map
                  </a>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="text-gray-900">{item.food_name}</p>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-orange-600">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-900 font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Select an order to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
