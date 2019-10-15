import { IPlayer } from "../interfaces/IPlayer"
export class Player implements IPlayer {
    id: string;
    name: string;
    additions = 0;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    setAddition(count: number) {
        this.additions = count;
    }
    resetAddition() {
        this.additions = 0;
    }
}
