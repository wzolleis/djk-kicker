import {prisma} from "~/db.server";
import {MailType} from "~/config/applicationTypes";

export const createMail = async ({
                                     actionId,
                                     playerId,
                                     status,
                                     statusTxt,
                                     mailType
                                 }: { actionId: string, playerId: string, status: number, statusTxt: string | undefined, mailType: MailType }) => {
    return await prisma.mail.create({
        data: {
            actionId,
            playerId,
            status,
            statusTxt,
            mailType
        }
    })
}