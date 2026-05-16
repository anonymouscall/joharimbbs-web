require('dotenv').config({ override: true });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@joharimbbs.com' },
    update: {},
    create: {
      email: 'admin@joharimbbs.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // 2. Clear old products
  await prisma.product.deleteMany();

  // 3. Insert all products extracted from the original shop page
  const products = [
    { name: 'Anatomy 2.0 Champions', slug: 'anatomy-2-0', price: 899, category: 'Anatomy', description: 'Modules With Flash Cards and IMP Topics List', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/07/Anatomy-2.0-cover-e1689366521975.jpg' },
    { name: 'Anatomy V.1&2 and Physiology', slug: 'anatomy-v1-2-physiology', price: 1499, category: 'Bundle', description: 'JOHARI MBBS MODULES', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/Combo-Anatomy-Physio-1.png' },
    { name: 'Biochemistry Module', slug: 'biochemistry-module', price: 399, category: 'Biochemistry', description: 'Complete your biochemistry syllabus in 7 days.', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/Biochemistry-cover-1.jpg' },
    { name: 'Community Medicine Park’s PSM Structured Notes', slug: 'community-medicine-psm', price: 899, category: 'PSM', description: 'Volume 1 and 2 | Complete PSM Notes', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/07/PSM-cover-1.jpg' },
    { name: 'Essential Microbiology', slug: 'essential-microbiology', price: 799, category: 'Microbiology', description: '2nd Year Module', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/Microbiology-cover-1.jpg' },
    { name: 'First Year All Book Combo', slug: 'first-year-combo', price: 1699, category: 'Bundle', description: 'with Important Topic Flowcharts', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/1st-Year-Combo-1.png' },
    { name: 'Pathology and Microbiology Combo', slug: 'pathology-microbiology', price: 1499, category: 'Bundle', description: 'JOHARI MBBS MODULES', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/Combo-Patho-Micro-1.png' },
    { name: 'Pharmacology in Fingertips', slug: 'pharmacology-fingertips', price: 799, category: 'Pharmacology', description: '2nd Year Modules', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/Pharmacology-cover-1.jpg' },
    { name: 'Physiology Modules', slug: 'physiology-modules', price: 799, category: 'Physiology', description: 'Physiology Modules', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/Physiology-cover-1.jpg' },
    { name: 'Productive Pathology', slug: 'productive-pathology', price: 899, category: 'Pathology', description: '2nd Year Modules', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/Pathology-cover-1.jpg' },
    { name: 'Second Year All Book Combo', slug: 'second-year-combo', price: 2199, category: 'Bundle', description: 'Pathology, Pharmacology, Microbiology', imageUrl: 'https://joharimbbs.com/wp-content/uploads/2023/04/2nd-Year-Combo-1.png' },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // 4. Default Marketing Messages
  const messages = [
    { triggerEvent: 'PURCHASE_SUCCESS', messageBody: 'Thank you for your purchase! Your modules are ready.', channel: 'EMAIL' },
    { triggerEvent: 'PAYMENT_FAILED', messageBody: 'Oh no, your payment failed! If any amount was debited, it will be refunded. Click here to try again.', channel: 'WHATSAPP' },
    { triggerEvent: 'CART_ABANDONED', messageBody: 'Hey! We noticed you left some modules in your cart. Come back and finish your preparation for exams!', channel: 'WHATSAPP' },
  ];

  for (const m of messages) {
    await prisma.marketingMessage.upsert({
      where: { triggerEvent: m.triggerEvent },
      update: {},
      create: m,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
