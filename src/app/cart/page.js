"use client";

import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import Script from 'next/script';

export default function CartPage() {
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleCheckout = async () => {
    if (cartTotal === 0) return;
    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal })
      });
      
      const order = await res.json();

      if (!order.id) {
        throw new Error('Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Fallback to a generic test key for demo if env missing
        amount: order.amount,
        currency: order.currency,
        name: "Johari MBBS",
        description: "Premium Study Modules",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setPaymentStatus('success');
            clearCart();
          } else {
            setPaymentStatus('failed');
          }
        },
        prefill: {
          name: "Test Student",
          email: "student@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#0B2B40" // Our primary color
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        setPaymentStatus('failed');
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <h2>Your Cart</h2>
        
        {paymentStatus === 'success' && (
          <div style={{ padding: '2rem', background: '#e6fffa', color: '#2c7a7b', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3>Payment Successful!</h3>
            <p>Thank you for your purchase. You now have access to your premium modules.</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div style={{ padding: '2rem', background: '#fff5f5', color: '#c53030', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3>Payment Failed</h3>
            <p>Your transaction could not be completed. Please try again.</p>
          </div>
        )}

        {cartItems.length === 0 && paymentStatus !== 'success' ? (
          <p style={{ marginTop: '2rem' }}>Your cart is empty. Go back and add some modules!</p>
        ) : (
          !paymentStatus && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginTop: '3rem' }}>
              <div>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'white', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'gray', margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold', margin: 0 }}>₹{item.price * item.quantity}</p>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem' }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{cartTotal}</span>
                </div>
                <button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? 'Processing...' : `Pay ₹${cartTotal} securely`}
                </button>
                <p style={{ fontSize: '0.8rem', color: 'gray', textAlign: 'center', marginTop: '1rem' }}>Powered by Razorpay</p>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
