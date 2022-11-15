const routeLinks = {
    admin: {
        games: "/application/admin/games",
        game: {
            details:  (gameId: string) => `/application/admin/games/${gameId}`,
            einladung: (gameId: string) => `/application/admin/games/${gameId}/einladung`,
            zusage: (gameId: string) => `/application/admin/games/${gameId}/zusage`,
            absage: (gameId: string) => `/application/admin/games/${gameId}/absage`
        }
    }
}

export default routeLinks