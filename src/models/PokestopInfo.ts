import { IPokestopInfo } from "../interfaces/IPokestopInfo";
export class PokestopInfo implements IPokestopInfo {
    time: string | null = null;
    titel: string | null = null;
    description: string | null = null;
    misc: string | null = null;
    distance_alert: string | null = null;
    unkown: any | null = null;
    constructor(info: string[]) {
        this.time = info[0];
        this.titel = info[1];
        this.description = info[2];
        this.misc = info[3];
        this.distance_alert = info[4];
        this.unkown = info[5];
    }
}
