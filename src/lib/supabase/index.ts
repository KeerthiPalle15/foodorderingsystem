import { supabase, createServerClient } from './client';
import { Database } from './database.types';

// Type aliases for convenience
type FoodItemRow = Database['public']['Tables']['food_items']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type CouponRow = Database['public']['Tables']['coupons']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Food Items
export async function getFoodItems(options?: { categoryId?: string; available?: boolean; limit?: number }) {
  let query = supabase
    .from('food_items')
    .select('*, category:categories(*)');

  if (options?.categoryId && options.categoryId !== 'all') {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.available !== undefined) {
    query = query.eq('is_available', options.available);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order('rating', { ascending: false });
  
  if (error) throw error;
  return data as (FoodItemRow & { category: CategoryRow })[];
}

export async function getFoodItemById(id: string) {
  const { data, error } = await supabase
    .from('food_items')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as FoodItemRow & { category: CategoryRow };
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  
  if (error) throw error;
  return data as CategoryRow[];
}

// Orders
export async function createOrder(orderData: {
  userId: string;
  items: { foodItemId: string; quantity: number; unitPrice: number; specialInstructions?: string }[];
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryInstructions?: string;
  paymentMethod: 'card' | 'cash' | 'wallet';
  couponCode?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
}) {
  const serverClient = createServerClient();
  
  // Generate order number
  const orderNumber = `ORD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Create order
  const { data: order, error: orderError } = await (serverClient.from('orders') as any)
    .insert({
      user_id: orderData.userId,
      order_number: orderNumber,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      delivery_fee: orderData.deliveryFee,
      tax: orderData.tax,
      total: orderData.total,
      coupon_code: orderData.couponCode,
      delivery_address: orderData.deliveryAddress,
      delivery_phone: orderData.deliveryPhone,
      delivery_instructions: orderData.deliveryInstructions,
      payment_method: orderData.paymentMethod,
      status: 'pending',
      payment_status: 'pending',
    } as any)
    .select()
    .single();
  
  if (orderError) throw orderError;
  if (!order) throw new Error('Failed to create order');
  
  // Create order items
  const orderItems = orderData.items.map((item) => ({
    order_id: (order as any).id,
    food_item_id: item.foodItemId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    subtotal: item.unitPrice * item.quantity,
    special_instructions: item.specialInstructions,
  }));
  
  const { error: itemsError } = await (serverClient.from('order_items') as any)
    .insert(orderItems);
  
  if (itemsError) throw itemsError;
  
  return order as OrderRow;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', userId)
    .order('order_date', { ascending: false });
  
  if (error) throw error;
  return data as (OrderRow & { items: OrderItemRow[] })[];
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', orderId)
    .single();
  
  if (error) throw error;
  return data as OrderRow & { items: OrderItemRow[] };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const serverClient = createServerClient();
  
  const { data, error } = await (serverClient.from('orders') as any)
    .update({ 
      status,
      delivered_at: status === 'delivered' ? new Date().toISOString() : undefined,
    } as any)
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Coupons
export async function validateCoupon(code: string, _userId?: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();
  
  if (error || !data) {
    return { valid: false, error: 'Invalid coupon code' };
  }
  
  const coupon = data as CouponRow;
  const now = new Date();
  const validFrom = new Date(coupon.valid_from);
  const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
  
  if (now < validFrom) {
    return { valid: false, error: 'Coupon is not yet active' };
  }
  
  if (validUntil && now > validUntil) {
    return { valid: false, error: 'Coupon has expired' };
  }
  
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, error: 'Coupon usage limit reached' };
  }
  
  return { valid: true, coupon };
}

export async function incrementCouponUsage(couponId: string) {
  const serverClient = createServerClient();
  
  const { data, error } = await (serverClient.rpc as any)('increment_coupon_usage', { coupon_id: couponId });
  
  if (error) throw error;
  return data;
}

// Admin Functions
export async function getAdminStats() {
  const serverClient = createServerClient();
  
  // Get total revenue from completed orders
  const { data: revenueData } = await (serverClient.from('orders') as any)
    .select('total')
    .eq('payment_status', 'completed');
  
  const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
  
  // Get order count
  const { count: orderCount } = await serverClient
    .from('orders')
    .select('*', { count: 'exact', head: true });
  
  // Get user count
  const { count: userCount } = await serverClient
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');
  
  return {
    totalRevenue,
    orderCount: orderCount || 0,
    userCount: userCount || 0,
    avgOrderValue: orderCount ? totalRevenue / orderCount : 0,
  };
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, user:profiles(*)')
    .order('order_date', { ascending: false });
  
  if (error) throw error;
  return data as (OrderRow & { user: ProfileRow })[];
}

// Profile
export async function updateProfile(userId: string, updates: Partial<ProfileRow>) {
  const { data, error } = await (supabase.from('profiles') as any)
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as ProfileRow;
}
