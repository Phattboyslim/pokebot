const { Datastore } = require("@google-cloud/datastore")

export class RaidStore {
    private datastore = new Datastore();

    async insert(raid: Raid) {
        try {
            return await this.datastore.save({
                key: this.datastore.key('Raids'),
                data: raid
            })
        } catch(error) {
            console.log(error)
        }
    }

    async get(key: string) {
        try {
            return await this.datastore.get(key)
        } catch (error) {
            console.log(error)
        }
    }
}

export class Raid {
    Guid: string | null = null;
    DateEnd: Date | null = null;
    GymName: string | null = null;
    IsHatched: boolean | null = null;
    PokemonName: string | null = null;
    Tiers: number | null = null;
}