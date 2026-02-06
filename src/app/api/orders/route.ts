import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { generateOrderNumber } from '@/lib/utils';
import type { Database } from '@/lib/supabase/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');

    if (orderId) {
      // Fetch single order
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            food_item:food_items(*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      return NextResponse.json({ order });
    }

    // Build query for user's orders
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      deliveryAddress,
      deliveryPhone,
      deliveryInstructions,
      paymentMethod,
      couponCode,
    } = body;

    // Validate required fields
    if (!userId || !items || !deliveryAddress || !deliveryPhone || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const discount = 0; // Calculate based on coupon
    const deliveryFee = subtotal > 0 ? 2.99 : 0;
    const tax = (subtotal - discount) * 0.08;
    const total = subtotal - discount + deliveryFee + tax;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        subtotal,
        discount,
        delivery_fee: deliveryFee,
        tax,
        total,
        coupon_code: couponCode,
        delivery_address: deliveryAddress,
        delivery_phone: deliveryPhone,
        delivery_instructions: deliveryInstructions,
        payment_method: paymentMethod,
        payment_status: 'pending',
        status: 'pending',
      } as any)
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // @ts-ignore
    const orderId = order?.id;

    // Create order items
    const orderItems = items.map((item: { foodItemId: string; price: number; quantity: number; specialInstructions?: string }) => ({
      order_id: orderId,
      food_item_id: item.foodItemId,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
      special_instructions: item.specialInstructions,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Fetch complete order with items
    // @ts-ignore
    const { data: completeOrder } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          food_item:food_items(*)
        )
      `)
      .eq('id', orderId)
      .single();

    return NextResponse.json({ order: completeOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/orders - Update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const query = (supabase as unknown as any)
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    const { data: order, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
