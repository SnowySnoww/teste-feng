import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedOrders() {
  console.log('🔄 Seeding orders...');

  const users = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { id: true },
  });

  if (users.length === 0) {
    console.warn('⚠️ Nenhum usuário encontrado para criar orders.');
    return;
  }

  const items = await prisma.item.findMany({
    select: { id: true, price: true },
  });

  if (items.length === 0) {
    console.warn('⚠️ Nenhum item encontrado para adicionar nas orders.');
    return;
  }

  const numOrders = Math.floor(Math.random() * 10) + 5;
  console.log(`📦 Criando ${numOrders} pedidos...`);

  for (const user of users) {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = items
      .sort(() => 0.5 - Math.random())
      .slice(0, numItems);

    const orderItems = selectedItems.map((item) => ({
      itemId: item.id,
      quantity: Math.floor(Math.random() * 5) + 1,
    }));

    await prisma.order.create({
      data: {
        userId: user.id,
        items: {
          create: orderItems,
        },
      },
    });

    console.log(`✅ Pedido criado para usuário ${user.id}`);
  }

  for (let i = 0; i < numOrders - users.length; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = items
      .sort(() => 0.5 - Math.random())
      .slice(0, numItems);

    const orderItems = selectedItems.map((item) => ({
      itemId: item.id,
      quantity: Math.floor(Math.random() * 5) + 1,
    }));

    await prisma.order.create({
      data: {
        userId: randomUser.id,
        items: {
          create: orderItems,
        },
      },
    });

    console.log(`✅ Pedido extra criado para usuário ${randomUser.id}`);
  }

  console.log('🎉 Seed de orders finalizada com sucesso!');
}
