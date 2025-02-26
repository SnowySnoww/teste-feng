// src/_db/seed-items.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = [
    {
      name: 'Cachorro Quente',
      description: 'Pão com salsicha, molho especial e batata palha',
      price: 8.0,
    },
    {
      name: 'Refrigerante Lata',
      description: 'Lata de refrigerante 350ml',
      price: 7.0,
    },
    {
      name: 'Hambúrguer',
      description: 'Pão, carne bovina, queijo e molho especial',
      price: 12.0,
    },
    {
      name: 'Fritas',
      description: 'Porção de batatas fritas',
      price: 10.0,
    },
    {
      name: 'Combo 01',
      description: 'Cachorro Quente + Refrigerante',
      price: 15.0,
    },
    {
      name: 'Combo 02',
      description: 'Hambúrguer + Fritas',
      price: 20.0,
    },
    {
      name: 'Refrigerante 350ml',
      description: 'Latinha de refrigerante 350ml',
      price: 10.0,
    },
    {
      name: 'Pipoca Grande',
      description: 'Balde de pipoca amanteigada',
      price: 12.0,
    },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: item,
    });
  }
}

async function seedItems() {
  try {
    await main();
  } catch (e) {
    console.error('❌ Error seeding items:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export { seedItems };
