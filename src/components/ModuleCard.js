"use client";

import { useCart } from '../context/CartContext';
import { useState } from 'react';

import Link from 'next/link';

export default function ModuleCard({ product }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <div className="module-card">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="module-img" />
        ) : (
          <div className="module-img" style={{ background: 'linear-gradient(135deg, #2D3748, #1A202C)', display: 'grid', placeItems: 'center', color: 'white', fontFamily: 'var(--font-heading)' }}>
            {product.category}
          </div>
        )}
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="module-price">
          <span>₹{product.price}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href={`/modules/${product.slug}`} style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>View Details</Link>
            <button className="btn-cart" onClick={handleAdd}>Add to Cart</button>
          </div>
        </div>
      </div>
      
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
