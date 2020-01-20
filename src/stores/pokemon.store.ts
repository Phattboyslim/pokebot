const { Datastore } = require("@google-cloud/datastore")

export class PokemonStore {
    private datastore = new Datastore();

    async insert(pokemon: Pokemon[]) {
        try {
            pokemon.forEach(async (mon: Pokemon) => {
                return await this.datastore.save({
                    key: this.datastore.key('Pokemon'),
                    data: mon
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    async searchByName(name: string) {
        const q = this.datastore
            .createQuery("Pokemon")
            .filter('name', '=', name)
            .limit(1)

        this.datastore.runQuery(q, (err: any, entities: any, info: any) => {
            // entities = An array of records.
            return entities
          })
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