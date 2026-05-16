import prisma from '@/lib/prisma';
import ProductList from '../components/ProductList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <>
      <section className="hero" id="home">
        <div className="container hero-content">
            <div className="hero-badge animate-fade-up" style={{animationDelay: '0.2s'}}>⭐ Over 300,000+ Students Nationwide</div>
            <h1 className="animate-fade-up" style={{animationDelay: '0.4s'}}>Master MBBS <br/><span className="text-gradient">With Confidence</span></h1>
            <p className="animate-fade-up" style={{animationDelay: '0.6s'}}>Elevating medical education in India. Stop memorizing, start understanding with our high-yield modules, handcrafted diagrams, and premium clinical insights.</p>
            <div className="hero-btns animate-fade-up" style={{animationDelay: '0.8s'}}>
                <a href="#modules" className="btn btn-primary">Explore Modules</a>
                <a href="https://web.joharimbbslectures.com/courses" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Join Live Classes</a>
            </div>
        </div>
      </section>

      <section className="modules reveal" id="modules">
        <div className="container">
            <div className="section-header">
                <h2>Premium Study Modules</h2>
                <p>The definitive resource for acing your university exams, featuring clinical anatomy, bone charts, and high-yield MCQs.</p>
            </div>
            
            <ProductList products={products} />
        </div>
      </section>

      <section className="testimonials reveal" id="testimonials" style={{ padding: '8rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Student Testimonials</h2>
            <p>Join over 300,000 students who rely on Johari MBBS to ace their university exams.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <div style={{ padding: '2rem', background: 'var(--bg-color)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>"Just have to read the topic from the module along with watching a video and I am sure I will pass the anatomy paper easily. This module is perfect!"</p>
              <h4 style={{ margin: 0 }}>Avnish Sharma</h4>
            </div>

            <div style={{ padding: '2rem', background: 'var(--bg-color)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>"It has everything that you need to study soo many details with the perfect diagrams with all the written content in it... it’s like a blessing to all of us."</p>
              <h4 style={{ margin: 0 }}>Surbhi Dangi</h4>
            </div>

            <div style={{ padding: '2rem', background: 'var(--bg-color)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>"This book just gave a positive vibe. Everything I need is just been put in a single book..I don’t need to go through all the textbooks now. Outstanding!"</p>
              <h4 style={{ margin: 0 }}>Vikas Sen</h4>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
