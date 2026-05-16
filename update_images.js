require('dotenv').config({ override: true });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const newImages = [
  "https://joharimbbs.com/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-09-at-8.59.29-PM8-300x300.jpeg",
  "https://joharimbbs.com/wp-content/uploads/2025/05/1year-combo-300x300.jpeg",
  "https://joharimbbs.com/wp-content/uploads/2024/12/WhatsApp-Image-2023-03-31-at-7.04.57-PM-300x300.jpeg",
  "https://joharimbbs.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-10-at-6.18.45-PM-1-300x300.jpeg",
  "https://joharimbbs.com/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-07-at-11.09.43_3a11c79c-1-300x300.jpg",
  "https://joharimbbs.com/wp-content/uploads/2024/12/WhatsApp-Image-2024-10-23-at-07.49.11_1247efd2-300x300.jpg",
  "https://joharimbbs.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-6.33.30-PM-300x300.jpeg",
  "https://joharimbbs.com/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-07-at-11.09.43_1a879fac-1-300x300.jpg",
  "https://joharimbbs.com/wp-content/uploads/2024/12/WhatsApp-Image-2024-10-23-at-07.49.09_ea31f92e-300x300.jpg",
  "https://joharimbbs.com/wp-content/uploads/2024/12/WhatsApp-Image-2024-10-23-at-07.49.10_de05f97c-300x300.jpg",
  "https://joharimbbs.com/wp-content/uploads/2024/12/WhatsApp-Image-2025-08-16-at-11.48.05-AM-300x300.jpeg"
];

async function main() {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  
  for (let i = 0; i < products.length; i++) {
    if (newImages[i]) {
      await prisma.product.update({
        where: { id: products[i].id },
        data: { imageUrl: newImages[i] }
      });
      console.log(`Updated ${products[i].name} with new image.`);
    }
  }
  console.log("Images updated successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
