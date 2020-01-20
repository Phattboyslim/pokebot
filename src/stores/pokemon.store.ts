const { Datastore } = require("@google-cloud/datastore")

export class PokemonStore {
    private datastore = new Datastore();

    async insert(pokemon: Pokemon[]) {
        try {
            return await this.datastore.insert({
                key: this.datastore.key('Pokemon'),
                data: pokemon
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

export class Pokemon {
    name: string | null = null
    number: number | null = null
}