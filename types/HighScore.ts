export interface HighScore {
    id: string,
    rank: number | null,
    score: number
}

export interface GlobalHighScore extends HighScore {
    user: string
}