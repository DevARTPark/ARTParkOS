import 'dotenv/config'; 
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// --- FIX: Explicitly pass the database URL ---
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function createUser() {
  const email = 'founder@artpark.in';
  const password = 'password123';
  const roles = ['founder', 'supplier'];

  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is missing from .env');
    return;
  }

  console.log('Creating user: ' + email + '...');

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password_hash: hashedPassword,
        roles: roles,
        status: 'active',
      },
      create: {
        email,
        password_hash: hashedPassword,
        roles: roles,
        status: 'active',
      },
    });

    console.log('------------------------------------------------');
    console.log('✅ SUCCESS! User created/updated.');
    console.log('📧 Email:    ' + user.email);
    console.log('🔑 Password: ' + password);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.();
  }
}

createUser();
