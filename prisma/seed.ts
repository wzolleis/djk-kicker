import { Player, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function generateName() {
  return faker.name.firstName();
}

function generateEmail() {
  return faker.internet.exampleEmail(undefined, undefined, { allowSpecialCharacters: false });
}

async function generateGames() {
  let i = 1;
  const games = [];
  while (i < 11) {
    const game = await prisma.game.create({
      data: {
        name: `Fußball ${i}.10.22`,
        link: `game${generateName()}`,
        gameTime: new Date(`2022-09-${i}`),
      },
    });
    games.push(game);
    i++;
  }
  return games;
}

async function generatePlayers() {
  const players: Player[] = [];
  for (let index = 0; index < 10; index++) {
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
  const games = await generateGames();
  console.log("created games");
  const players = await generatePlayers();
  console.log("created players");

  players.map((player) => {
    generateFeedback(player);
  });

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
