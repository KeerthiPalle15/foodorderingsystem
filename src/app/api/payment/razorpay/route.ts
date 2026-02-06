import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, customerEmail, customerName } = body;

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, you would use the Razorpay SDK:
    // import Razorpay from 'razorpay';
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID!,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
    // });
    //
    // const order = await razorpay.orders.create({
    //   amount: amount * 100, // Convert to paise
    //   currency: 'INR',
    //   receipt: orderId,
    //   notes: {
    //     customer_email: customerEmail,
    //     customer_name: customerName,
    //   },
    // });

    // For demo purposes, return a mock order
    const mockRazorpayOrder = {
      id: `razorpay_${Date.now()}`,
      entity: 'order',
      amount: amount * 100,
      amount_paid: 0,
      amount_due: amount * 100,
      currency: 'INR',
      receipt: orderId,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({
      success: true,
      order: mockRazorpayOrder,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'test_key_id',
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify payment callback
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // In production, verify the signature:
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(razorpayOrderId + '|' + razorpayPaymentId)
    //   .digest('hex');
    //
    // if (expectedSignature !== razorpaySignature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
