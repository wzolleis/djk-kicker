export const playerImageByRating = ({rating}: { rating: number }) => {
    if (rating > 80) {
        return "/img/players/player_100_3.svg"
    } else if (rating > 50) {
        return "/img/players/player_50.svg"
    } else {
        return "/img/players/player_20.svg"
    }
}