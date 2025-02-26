import { PrismaClient } from '@prisma/client';
import { seedAdmin } from './seed-admin';
import { seedClients } from './seed-clients';
import { seedItems } from './seed-items';
import { seedOrders } from './seed-orders';

const prisma = new PrismaClient();

export const runSeeds = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Executar as seeds na ordem correta
    await seedAdmin();
    console.log('✅ Seed de admin concluída.');

    await seedClients();
    console.log('✅ Seed de clientes concluída.');

    await seedItems();
    console.log('✅ Seed de itens concluída.');

    await seedOrders();
    console.log('✅ Seed de pedidos concluída.');

    console.log('🎉 Seeding finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a execução das seeds:', error);
  } finally {
    await prisma.$disconnect();
  }
};

runSeeds();
