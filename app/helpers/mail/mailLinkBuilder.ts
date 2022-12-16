const gameInvitationLink = ({
                                host,
                                gameId,
                                token,
                            }: { host: string, gameId: string, token: string }): string => {
    const protocol = urlProtocol(host)
    return `${protocol}://${host}/application/games/${gameId}?token=${token}`
}

const adminInvitationLink = ({
                                 host,
                                 inviteId,
                                 token,
                             }: { host: string, inviteId: string, token: string }): string => {
    const protocol = urlProtocol(host)
    return `${protocol}://${host}/application/admin/users/invites/${inviteId}/response?token=${token}`
}

const isSecureProtocol = (host: string) => (host.startsWith("djk-kicker.netlify.app") || host.startsWith("kicker.timzolleis.com"))

const urlProtocol = (host: string): string => isSecureProtocol(host) ? "https" : "http"


export default {
    gameInvitationLink,
    isSecureProtocol,
    urlProtocol,
    adminInvitationLink
}

