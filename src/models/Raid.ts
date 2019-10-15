import { IPlayer } from "../interfaces/IPlayer";
import { IRaid } from "../interfaces/IRaid";
export class Raid implements IRaid {
    messageId: string;
    messageTitle: string;
    players: IPlayer[];
    dtEnd: Date;
    constructor(messageId: string, messageTitle: string, players: IPlayer[], dtEnd: Date) {
        this.messageId = messageId;
        this.messageTitle = messageTitle;
        this.players = players;
        this.dtEnd = dtEnd;
    }
    addPlayer(player: IPlayer): void {
        this.players.push(player);
    }
    removePlayer(player: IPlayer): void {
        var index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }
    close(): void {
        this.dtEnd = new Date("1970-01-01");
    }
    get closed(): boolean {
        return this.dtEnd <= new Date();
    }
}
