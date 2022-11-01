import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@test.de";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
  });

  const hashedPassword = await bcrypt.hash("test@test.de", 10);

  const user = await prisma.user.create({
    data: {
      email,
      testUser: true,
      name: 'Jack TestUser',
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });

  console.log("created user with id: ", user.id);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
