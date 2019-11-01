import { IPlayer } from "../interfaces/player.interface";
import { IRaid } from "../interfaces/raid.interface";
export class Raid implements IRaid {
    messageId: string;
    messageTitle: string;
    players: IPlayer[];
    dtEnd: Date;
    startedBy: IPlayer;
    constructor(messageId: string, messageTitle: string, players: IPlayer[], dtEnd: Date, startedBy: IPlayer) {
        this.messageId = messageId;
        this.messageTitle = messageTitle;
        this.players = players;
        this.dtEnd = dtEnd;
        this.startedBy = startedBy;
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

    static RaidCommandRegularExpression() {
        return "(start\\s)([Tt])([1-5]{1})(( \\w+){1,4}\\s)(\\b([0-9]|1[0-9]|2[0-3])\\b)(\\:)(0*([1-9]|[1-4][0-9]|5[0-9]))"
    }
    static RaidCommandInvalidErrorMessage(){
        return "Invalid command. Usage: !raid start <T1-5> <1-4 words describing place / area> <24h-time>"
    }
    static RaidTimeRegularExpression() {
        return "(\\b([0-9]|1[0-9]|2[0-3])\\b)(\\:)(0*([1-9]|[1-4][0-9]|5[0-9]))"
    }
}
