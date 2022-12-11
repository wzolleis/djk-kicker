import {AdminInvitation} from "@prisma/client";
import {DateTime} from "luxon";
import {prisma} from "~/db.server";

export const createAdminInvitation = async ({
                                           name, email, validUntil, token, scope
                                       }: {
    name: string
    email: string
    validUntil: DateTime
    token: string,
    scope: string
}): Promise<AdminInvitation> => {
    return await prisma.adminInvitation.create({
        data: {
            name,
            email,
            expires_at: validUntil.toJSDate(),
            token,
            scope
        }
    });
};