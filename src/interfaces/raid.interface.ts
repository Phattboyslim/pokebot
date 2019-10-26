import { IPlayer } from "./player.interface";

export interface IRaid {
    messageId: string;
    messageTitle: string;
    players: IPlayer[];
    dtEnd: Date;
    closed: boolean
    startedBy: IPlayer

    addPlayer(player: IPlayer): void
    removePlayer(player: IPlayer): void
    close(): void
}

