import { injectable } from "../../node_modules/inversify";
import { isNullOrUndefined } from "util";
import { ApiClient } from "../clients/http.client";

@injectable()
export class PokemonService {
    async searchPokemonCounter(name: string) {
        var client = new ApiClient()
        var request = await client.get("http://www.mocky.io/v2/5dbd8fb63300001b8016a222")
        var pokemonCounters: any = null
        if(!isNullOrUndefined(request)) {
            pokemonCounters = request.pokemonCounters
        }
        var pokemon = pokemonCounters.filter((x: any) => x.name.toLowerCase() == name.toLowerCase())
        if(!isNullOrUndefined(pokemon)) {
            return pokemon
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
    attacks: string[]
}