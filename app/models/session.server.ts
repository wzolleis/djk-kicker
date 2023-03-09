import {prisma} from "~/db.server";

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
