import { injectable } from "inversify";
import { isNullOrUndefined } from "util";
import { ApiClient } from "../clients/http.client";

@injectable()
export class PokemonService {
    async searchPokemonCounter(name: string) {
        var client = new ApiClient()
        var request = await client.get("http://www.mocky.io/v2/5dbe9df2330000f130a0e40b")
        var pokemonCounters: any = null
        if(!isNullOrUndefined(request)) {
            pokemonCounters = request
            console.log(JSON.stringify(pokemonCounters))
        }
        var pokemon = pokemonCounters.filter((x: any) => x.name.toLowerCase() == name.toLowerCase())
        if(!isNullOrUndefined(pokemon)) {
            return pokemon
        } else {
            return null
        }
    }
    async getCountersList() {
        var client = new ApiClient()
        var request = await client.get("http://www.mocky.io/v2/5dbe9df2330000f130a0e40b")
        if(!isNullOrUndefined(request)) {
            var list = request.map((x: any)=>x.name)
            return list
        } else {
            return null
        }
    }
}

export interface PokemonCounter {
    name: string
    counters: PokemonWithAttackCounter[]
    thumbnail: string
}
export interface PokemonWithAttackCounter {
    name: string
    attacks: string[][]
}