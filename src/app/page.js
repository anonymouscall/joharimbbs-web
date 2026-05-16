import prisma from '@/lib/prisma';
import ProductList from '../components/ProductList';

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
                <a href="#courses" className="btn btn-outline">Join Live Classes</a>
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
    </>
  );
}
