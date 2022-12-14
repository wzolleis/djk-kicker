const routeLinks = {
    admin: {
        adminLandingPage: "/application/admin/",
        games: "/application/admin/games",
        deleteExpiredGames: "/application/admin/games/deleteExpired",
        game: {
            details: (gameId: string) => `/application/admin/games/${gameId}`,
            einladung: (gameId: string) => `/application/admin/games/${gameId}/einladung`,
            zusage: (gameId: string) => `/application/admin/games/${gameId}/zusage`,
            absage: (gameId: string) => `/application/admin/games/${gameId}/absage`,
            actions: (gameId: string) => `/application/admin/games/${gameId}/actions`,
            invitation: (gameId: string) => `/application/admin/games/${gameId}/invitation`,
            edit:  (gameId: string) => `/application/admin/games/${gameId}/edit`,
            delete:  (gameId: string) => `/application/admin/games/${gameId}/delete`,
        },
        users: {
            useradministration: '/application/admin/users/users',
            home: '/application/admin/users',
            create: '/application/admin/users/new',
            delete: (userId: string) => `/application/admin/users/${userId}/delete`,
            invite: {
                create: '/application/admin/users/invites/new',
                delete: (inviteId: string) => `/application/admin/users/invites/${inviteId}/delete`,
                accept: ({
                             inviteId,
                             token
                         }: { inviteId: string, token: string }) => `/application/admin/users/invites/${inviteId}/accept?token=${token}`
            },

        },
    },
    games: '/application/games',
    game: (gameId: string) => `/application/games/${gameId}`,
    dashboard: '/application/dashboard',
    player: {
        create: `/application/player/create`,
        createForGame: (gameId: string) => `/application/player/create?gameid=${gameId}`,
        delete: (playerId: string) => `/application/player/${playerId}/delete`,
        profile: (playerId: string) => `/application/player/${playerId}/profile`,
        feedback: ({
                       gameId,
                       playerId
                   }: { gameId: string, playerId: string }): string => `/application/games/${gameId}/player/${playerId}?index`
    },
    playerNotAuthenticated: '/application/notAuthenticated',
    application: '/application'
}

export default routeLinks