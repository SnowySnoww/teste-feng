import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@festival.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@festival.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
}
