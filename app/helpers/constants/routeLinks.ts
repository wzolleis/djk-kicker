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
            create: '/application/admin/users/new',
            invite: '/application/admin/users/invite',
        }
    },
}

export default routeLinks