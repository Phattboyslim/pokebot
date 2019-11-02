import { injectable } from "../../node_modules/inversify";
import { isNullOrUndefined } from "util";

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
    },
    {
        name: "Regirock",
        counters: [
            {
                name: "Metagross",
                attacks: ["Bullet Prunch", "Meteor Mash"]
            },
            {
                name: "Kyogre",
                attacks: ["Waterfall", "Hydro Pump"]
            },
            {
                name: "Swampert",
                attacks: ["Water Gun", "Hydro Cannon"]
            },
            {
                name: "Machamp",
                attacks: ["Counter", "Dynamic Punch"]
            },
            {
                name: "Dialga",
                attacks: ["Metal Claw", "Iron Head"]
            },
            {
                name: "Excadrill",
                attacks: ["Metal Claw", "Drill Run"]
            },

        ],
        thumbnail: "https://img.pokemondb.net/artwork/regirock.jpg"
    },
    {
        name: "Registeel",
        counters: [
            {
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
            },
            {
                name: "Breloom",
                attacks: ["Counter", "Dynamic Punch"]
            }
        ],
        thumbnail: "https://img.pokemondb.net/artwork/registeel.jpg"
    }
]

@injectable()
export class PokemonService {
    searchPokemonCounter(name: string) {
        var pokemon = pokemonCounters.filter(x => x.name.toLowerCase() == name.toLowerCase())
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