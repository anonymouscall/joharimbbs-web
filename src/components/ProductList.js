"use client";

import { useEffect } from 'react';
import ModuleCard from './ModuleCard';

export default function ProductList({ products }) {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
    
    return () => revealElements.forEach(el => revealOnScroll.unobserve(el));
  }, []);

  return (
    <div className="module-grid">
      {products.map(product => (
        <ModuleCard key={product.id} product={product} />
      ))}
    </div>
  );
}
