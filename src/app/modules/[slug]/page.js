import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartButton from '../../../components/AddToCartButton';

export async function generateStaticParams() {
  const products = await prisma.product.findMany();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  
  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        
        {/* Product Image */}
        <div style={{ background: '#f5f5f5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, #2D3748, #1A202C)', color: 'white', minHeight: '400px', display: 'grid', placeItems: 'center' }}>
              <h2>{product.name}</h2>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.category || 'Premium Module'}
          </span>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.2' }}>{product.name}</h1>
          <p style={{ fontSize: '1.2rem', color: 'gray', marginBottom: '2rem', lineHeight: '1.6' }}>
            {product.description}
          </p>
          
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '2rem' }}>
            ₹{product.price}
          </div>

          <AddToCartButton product={product} />

          <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>What's Included:</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ Instant Digital Access</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ High-Yield Flowcharts</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Important Exam Topics List</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Printable PDF Format</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
