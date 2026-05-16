import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Note: Using a test key for demo
      key_secret: process.env.RAZORPAY_KEY_SECRET || '51oA7oJ9nC3K03P82KxW9BqP', // Note: Test secret for demo
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await instance.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
