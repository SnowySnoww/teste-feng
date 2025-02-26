import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedClients() {
  const clients = [
    {
      name: 'João Silva',
      email: 'joao.silva@festival.com',
      password: 'cliente123',
      phone: '123-456-7890',
    },
    {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@festival.com',
      password: 'cliente123',
      phone: '234-567-8901',
    },
    {
      name: 'Carlos Souza',
      email: 'carlos.souza@festival.com',
      password: 'cliente123',
      phone: '345-678-9012',
    },
  ];

  for (const clientData of clients) {
    const hashedPassword = await bcrypt.hash(clientData.password, 10);

    await prisma.user.upsert({
      where: { email: clientData.email },
      update: {
        name: clientData.name,
        password: hashedPassword,
        phone: clientData.phone,
        role: 'CLIENT',
      },
      create: {
        name: clientData.name,
        email: clientData.email,
        password: hashedPassword,
        phone: clientData.phone,
        role: 'CLIENT',
      },
    });
  }
}
