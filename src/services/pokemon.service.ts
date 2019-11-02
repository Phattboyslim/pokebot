import { injectable } from "../../node_modules/inversify";

const pokemonCounters = [
    {
        name: "Regice",
        counters: [
            {
                name: "Metagross",
                attacks: ["Bullet Punch", "Meteor Mash"]
            }, {
                name: "Chandelure",
                attacks: ["Fire Spin", "Overheat"]
            },
            {
                name: "Blaziken",
                attacks: ["Fire Spin", "Blast Burn"]
            },
            {
                name: "Moltres",
                attacks: ["Fire Spin", "Overheat"]
            },
            {
                name: "Machamp",
                attacks: ["Counter", "Dynamic Punch"]
            },
            {
                name: "Entei",
                attacks: ["Fire Fang", "Overheat"]
            }
        ],
        thumbnail: "https://img.pokemondb.net/artwork/regice.jpg"
    }
]

@injectable()
export class PokemonService {
    searchPokemonCounter(name: string) {
        return pokemonCounters.filter(x => x.name == name)
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