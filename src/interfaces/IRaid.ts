import { IPlayer } from "./IPlayer";

export interface IRaid {
    messageId: string;
    messageTitle: string;
    players: IPlayer[];
    dtEnd: Date;
    closed: boolean

    addPlayer(player: IPlayer): void
    removePlayer(player: IPlayer): void
    close(): void
}

