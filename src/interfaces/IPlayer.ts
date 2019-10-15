export interface IPlayer {
    id: string
    name: string
    additions: number

    setAddition(count: number): void
    resetAddition(): void
}

