require('dotenv').config();
const { PrismaClient } = require('./lib/generated');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const email = 'frinzkadesfrilia12@gmail.com';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found, creating now...");
      user = await prisma.user.create({
        data: {
          email,
          name: 'Frinzka Desfrilia',
          role: 'masyarakat',
          password: ''
        }
      });
      console.log('CREATED SUCCESSFULLY:', user.id);
    } else {
      console.log('USER ALREADY EXISTS:', user.id);
    }
  } catch(e) {
    console.error('ERROR OCCURRED:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
