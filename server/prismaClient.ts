import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// 1. Create a Postgres Connection Pool
const pool = new pg.Pool({ connectionString });

// 2. Create the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma Client with the Adapter
export const prisma = new PrismaClient({ adapter });