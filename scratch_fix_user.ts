import { prisma } from './lib/prisma';

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
    console.error('ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
