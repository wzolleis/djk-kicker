import {AdminInvitation} from "@prisma/client";
import {DateTime} from "luxon";
import {prisma} from "~/db.server";
import {AdminInvitationStatus} from "~/config/status";

export type AdminInvitationUpdate = {
    name: string
    invitationStatus: AdminInvitationStatus
}

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

export const getAdminInvitations = async (): Promise<AdminInvitation[]> => {
    return await prisma.adminInvitation.findMany()
}

export const getAdminInvitation = async (inviteId: string) => {
    return await prisma.adminInvitation.findUnique({
        where: {
            id: inviteId
        }
    })
}

export const updateAdminInvitation = async (invitationid: string, updateData: AdminInvitationUpdate) => {
    const {name, invitationStatus} = updateData
    return await prisma.adminInvitation.update({
        where: {
            id: invitationid
        },
        data: {
            name, invitationStatus
        }
    })
}