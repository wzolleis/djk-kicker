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
      name: "Jack TestUser",
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });


  const game = await prisma.game.create({
    data: {
      name: "Fußball, 22.10.2022",
      link: "abcdefg"
    }
  });


  console.log("created user with id: ", user.id);
  console.log("created game with id: ", game.id);

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
