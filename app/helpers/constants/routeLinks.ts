const routeLinks = {
    admin: {
        games: "/application/admin/games",
        game: {
            details:  (gameId: string) => `/application/admin/games/${gameId}`,
            einladung: (gameId: string) => `/application/admin/games/${gameId}/einladung`,
            zusage: (gameId: string) => `/application/admin/games/${gameId}/zusage`,
            absage: (gameId: string) => `/application/admin/games/${gameId}/absage`,
            actions: (gameId: string) => `/application/admin/games/${gameId}/actions`,
            invitation: (gameId: string) => `/application/admin/games/${gameId}/invitation`,
        },
        users: {
            home: '"/application/admin/users',
            create: '/application/admin/users/new',
            invite: {
                create: '/application/admin/users/invites/new',
                accept: ({inviteId, token} : {inviteId: string, token: string}) => `/application/admin/users/invites/${inviteId}/accept?token=${token}`
            },

        },
    },
    games: '/application/games'
}

export default routeLinks