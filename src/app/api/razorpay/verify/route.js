import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      items,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || '51oA7oJ9nC3K03P82KxW9BqP';

    // Create signature to verify against the one received from frontend
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment verified — save the order to the database
      const order = await prisma.order.create({
        data: {
          razorpayOrderId: razorpay_order_id,
          total: amount || 0,
          status: 'SUCCESS',
          items: JSON.stringify(items || []),
          customerName: shippingName || null,
          customerEmail: shippingEmail || null,
          customerPhone: shippingPhone || null,
          shippingAddress: shippingAddress || null,
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and order saved successfully',
        orderId: order.id
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
