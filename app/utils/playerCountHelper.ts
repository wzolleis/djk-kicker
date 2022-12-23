const add = (playerCount: number): number => {
    return playerCount + 1
}

const subtract = (playerCount: number): number => {
    const next = playerCount - 1
    return next >= 0 ? next : 0
}

export default {
    add, subtract
}