"use client";

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <img src="https://joharimbbs.com/wp-content/uploads/2022/11/Johri-mbbs-2-1.png" alt="Johari MBBS Logo" style={{ height: '40px', width: 'auto' }} />
        </Link>
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/#modules">Modules</Link></li>
          <li><Link href="https://web.joharimbbslectures.com/courses" target="_blank" rel="noopener noreferrer">Courses</Link></li>
          <li><Link href="/#testimonials">Testimonials</Link></li>
        </ul>
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="cart-icon" onClick={() => router.push('/cart')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className={`cart-badge ${cartCount > 0 ? 'bump' : ''}`} key={cartCount}>
              {cartCount}
            </span>
          </div>
          
          {session ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/admin" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Dashboard</Link>
              <button onClick={() => signOut()} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Log In</Link>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
