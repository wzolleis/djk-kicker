import {prisma} from "~/db.server";
import {Session} from "@prisma/client"

export const deleteSessionForPlayer = async (playerId: string) => {
    const sessions = await prisma.session.findMany()
    const sessionsForPlayer = sessions.filter(session => {
        const data = JSON.parse(session.data)
        if (!!data.player?.id) {
            return data.player?.id === playerId
        }
    })

    const sessionIds = sessionsForPlayer.map(session => session.id)

    return prisma.session.deleteMany({
        where: {
            id: {in: sessionIds}
        }
    })
}

export const createSession = async (sessionData: string): Promise<Session> => {
    return await prisma.session.create({
        data: {
            data: sessionData
        }
    })
}

export const deleteSessionByID =  async (sessionId: string) => {
    return await prisma.session.delete({
        where: {
            id: sessionId
        }
    })
}

export const findSessionByID = async (sessionId: string): Promise<Session | null> => {
    return await prisma.session.findUnique({
        where: {
            id: sessionId
        },
    });
}

export const upsertSession = async ({sessionId, sessionData}: {sessionId: string, sessionData: string}): Promise<Session> => {
    return await prisma.session.upsert({
        where: {
            id: sessionId,
        },
        update: {
            data: sessionData,
        },
        create: {
            data: sessionData,
        },
    });
}