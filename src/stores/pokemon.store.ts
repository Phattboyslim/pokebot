const { Datastore } = require("@google-cloud/datastore")
const axios = require('axios').default;
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
        var retVal = null
        const q = this.datastore
            .createQuery("Pokemon")
            .filter('name', '=', name)
        await this.datastore.runQuery(q).then((result: any) => {
            // entities = An array of records.
            retVal = result
        })
        return retVal
    }

    async get(key: string) {
        try {
            return await this.datastore.get(key)
        } catch (error) {
            console.log(error)
        }
    }
    async getNamesFromRapiAPI() {
        var retVal = null
        await axios({
            "method": "GET",
            "url": "https://pokemon-go1.p.rapidapi.com/pokemon_names.json",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
                "x-rapidapi-key": "4e23a33e0emsh55a6269c414188fp10370djsn6d976e399e42"
            }
        })
            .then((response: any) => {
                console.log(response)
                retVal = response.body
            })
            .catch((error: any) => {
                console.log(error)
            })
        return retVal;
    }
}

export class Pokemon {
    name: string | null = null
    number: number | null = null
}