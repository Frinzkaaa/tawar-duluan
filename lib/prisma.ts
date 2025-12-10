import { PrismaClient } from "./generated";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg"

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL!;

// ⚠ Neon butuh SSL
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
