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
            home: '/application/admin/users',
            create: '/application/admin/users/new',
            delete: (userId: string) => `/application/admin/users/${userId}/delete`,
            invite: {
                create: '/application/admin/users/invites/new',
                delete: (inviteId: string) => `/application/admin/users/invites/${inviteId}/delete`,
                accept: ({inviteId, token} : {inviteId: string, token: string}) => `/application/admin/users/invites/${inviteId}/accept?token=${token}`
            },

        },
    },
    games: '/application/games',
    dashboard: '/application/dashboard',
    player: {
        delete: (playerId: string) => `/application/player/${playerId}/delete`
    }
}

export default routeLinks