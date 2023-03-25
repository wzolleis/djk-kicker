import {Player, PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";

const prisma = new PrismaClient();

function generateName() {
  return faker.name.firstName();
}

function generateEmail() {
  return faker.internet.exampleEmail(undefined, undefined, { allowSpecialCharacters: false });
}

async function generatePlayers() {
  const players: Player[] = [];
  for (let index = 0; index < 1; index++) {
    const player = await prisma.player.create({
      data: {
        name: generateName(),
        email: generateEmail(),
      },
    });
    players.push(player);
  }
  return players;
}

async function seed() {
  const email = "test@test.de";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {});

  await prisma.game.deleteMany();
  await prisma.player.deleteMany();
  await prisma.feedback.deleteMany();

  const hashedPassword = await bcrypt.hash("test@test.de", 10);

  const user = await prisma.user.create({
    data: {
      email,
      testUser: true,
      name: "Jack TestUser",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  console.log("created user with id: ", user.id);
  console.log("created games");
  const players = await generatePlayers();
  console.log("created players");

  players.map((player) => {
    generateFeedback(player);
  });

  players.map((player) => {
    generateRating(player)
  })

  console.log("created feedback");
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

async function generateFeedback(player: Player) {
  await prisma.defaultFeedback.create({
    data: {
      playerId: player.id,
    },
  });
}

async function generateRating(player: Player) {
  await prisma.playerRating.create({
    data: {
      playerId: player.id,
    },
  });
}
