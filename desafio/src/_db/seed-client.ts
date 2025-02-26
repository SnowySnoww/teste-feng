import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const clients = [
    {
      name: 'Client User 1',
      email: 'client1@festival.com',
      password: 'client123',
      phone: '123-456-7890',
    },
    {
      name: 'Client User 2',
      email: 'client2@festival.com',
      password: 'client123',
      phone: '234-567-8901',
    },
    {
      name: 'Client User 3',
      email: 'client3@festival.com',
      password: 'client123',
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

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
