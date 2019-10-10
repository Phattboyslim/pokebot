import { IPlayer } from "./IPlayer";

export interface IRaid {
    messageId: string;
    messageTitle: string;
    players: IPlayer[];
}
