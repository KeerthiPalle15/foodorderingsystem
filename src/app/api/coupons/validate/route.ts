import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Coupon = Database['public']['Tables']['coupons']['Row'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Fetch coupon from database
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Cast coupon to proper type
    const typedCoupon = coupon as Coupon;

    const now = new Date();
    const validFrom = new Date(typedCoupon.valid_from);
    const validUntil = typedCoupon.valid_until ? new Date(typedCoupon.valid_until) : null;

    if (now < validFrom) {
      return NextResponse.json(
        { valid: false, error: 'Coupon is not yet active' },
        { status: 400 }
      );
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json(
        { valid: false, error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    if (typedCoupon.usage_limit && typedCoupon.used_count >= typedCoupon.usage_limit) {
      return NextResponse.json(
        { valid: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: typedCoupon.id,
        code: typedCoupon.code,
        type: typedCoupon.type,
        discount_value: typedCoupon.discount_value,
        minimum_order: typedCoupon.minimum_order,
        maximum_discount: typedCoupon.maximum_discount,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
