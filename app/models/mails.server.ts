import {prisma} from "~/db.server";

export const createMail = async ({gameId, playerId, status, statusTxt, mailType}: {gameId: string, playerId: string, status: number, statusTxt: string | undefined, mailType: string}) => {
    return await prisma.mail.create({
        data: {
            gameId,
            playerId,
            status,
            statusTxt,
            mailType
        }
    })
}