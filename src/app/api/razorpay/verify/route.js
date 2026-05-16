import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || '51oA7oJ9nC3K03P82KxW9BqP';
    
    // Create signature to verify against the one received from frontend
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      // Here you would typically save the order details to your database
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify payment' }, { status: 500 });
  }
}
