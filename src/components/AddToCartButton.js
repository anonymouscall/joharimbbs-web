"use client";

import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <button 
        onClick={handleAdd}
        className="btn btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
      >
        Add to Cart
      </button>
      
      {showToast && (
        <div className="toast show" style={{ zIndex: 9999 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4CAF50' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {product.name} added to cart!
        </div>
      )}
    </>
  );
}
