const { Datastore } = require("@google-cloud/datastore")

export class RaidStore {
    private datastore = new Datastore();

    insert(raid: Raid){
        return this.datastore.save({
            key: this.datastore.key('Raids'),
            data: raid
        })
    }
}

export class Raid {
    DateEnd: Date | null = null;
    GymName: string | null = null;
    IsHatched: boolean | null = null;
    PokemonName: string | null = null;
    Tiers: number | null = null;
}