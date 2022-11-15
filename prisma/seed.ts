import {Game, Player, PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";

const prisma = new PrismaClient();

async function generateGames() {
    let i = 1
    const games = [];
    while (i < 11) {
        const game = await prisma.game.create({
            data: {
                name: `Fußball ${i}.10.22`,
                link: `game${generateName()}`,
                gameTime: new Date(`2022-09-${i}`),

            }
        })
        games.push(game)
        i++
    }
    return games;
}


async function seed() {
    const email = "test@test.de";

    // cleanup the existing database
    await prisma.user.delete({where: {email}}).catch(() => {
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


    const games = await generateGames();

    const players: Player[] = [];

    async function generatePlayers() {
        let i = 0;
        while (i < 10) {
            const player = await prisma.player.create({
                data: {
                    name: generateName(),
                    email: generateEmail()
                }
            });
            players.push(player);
            i++;
        }
    }

    await generatePlayers();
    console.log("created user with id: ", user.id);

    games.forEach(game => {
        players.forEach(player => {
            generateFeedback(player, game);
        });
    })
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

function generateName() {
    return faker.name.firstName()
}

function generateEmail() {
    return faker.internet.exampleEmail(undefined, undefined, {allowSpecialCharacters: false})
}

async function generateFeedback(player: Player, game: Game) {
    await prisma.feedback.create({
        data: {
            gameId: game.id,
            playerId: player.id,
            status: Math.random() > 0.5,
            note: generateName() + generateEmail()
        }
    });
}