import {prisma} from "~/db.server";
import {MailType} from "~/config/applicationTypes";

export type MailData = {
    gameId: string
    actionId: string
    playerId: string
    playerName: string
    status: number
    statusTxt: string | undefined
    mailType: MailType
}
export const createMail = async (mailData: MailData) => {
    return await prisma.mail.create({data: mailData})
}

export const updateMailStatus = async (mailId: string, status: number, statusTxt: string) => {
    return await prisma.mail.update({
        data: {
            status,
            statusTxt
        },
        where: {
            id: mailId
        }
    })
}