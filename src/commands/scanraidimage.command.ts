import { MessageHandler } from "discord-message-handler";
import { Message, TextChannel } from "discord.js";
import { isNullOrUndefined, isNull } from "util";
import { GoogleCloudClient } from "../services/google-cloud-vision.client";
import { dependencyInjectionContainer } from "../di-container";
import { ChannelIds } from "../models/channelIds.enum";
import { TextValidator } from "../clients/text.validator";
import { RaidStore } from "../stores/raid.store";
import { PokemonStore } from "../stores/pokemon.store";
import { pokemon } from "./../resources/statics/pokemon"
import { CustomString } from "../clients/discord.client";
import { GymInfo } from "../models/GymInfo";
const arrayWithGenerations: any[] = [pokemon.gen1, pokemon.gen2, pokemon.gen3, pokemon.gen4, pokemon.gen5];
var uuidv4 = require('uuid/v4')
export class ScanRaidImageCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!scan")
            .minArgs(0)
            .whenInvalid("Tis ni juste")
            .do(async (args: string[], rawArgs: string, message: Message) => {
                var returnMessage = "Ti etwa hjil skjif gegoan"
                var client: GoogleCloudClient = dependencyInjectionContainer.get<GoogleCloudClient>(GoogleCloudClient)
                var pokemonStore: PokemonStore = dependencyInjectionContainer.get<PokemonStore>(PokemonStore)
                var textValidator: TextValidator = dependencyInjectionContainer.get<TextValidator>(TextValidator)
                if (isNullOrUndefined(client) || isNullOrUndefined(pokemonStore)) {
                    return this.handleError(message, "Something went wrong. Please try again. If this problem persists, please contact support.")
                }
                if (message.channel.id != ChannelIds.RaidScanChannel.toString()) {
                    return this.handleError(message, "You are not allowed to do this here!")
                }
                var attachment = message.attachments.first();
                if (isNullOrUndefined(attachment.url) && attachment.url != "") {
                    return this.handleError(message, "Something went wrong fetching attachement url. Please try again. If this problem persists, please contact support.")
                }
                var textResults: string[] = await client.readImage(attachment.url)
                if (isNullOrUndefined(textResults)) {
                    return this.handleError(message, "Something went wrong getting text result from your image. Please try again. If this problem persists, please contact support.")
                }

                // start reading lines from textResult

                // 0:"4G+"
                // 1:"87% I 16:52"
                // 2:"EX RAID GYM"
                // 3:"Standbeeld Albrecht"
                // 4:"Rodenbach"
                // 5:"0:48:32"
                // 6:"Walk closer to interact with this Gym."
                // 7:""

                var resultWithNumbers: any[] = []
                var resultWithoutNumbers: any[] = []

                textResults.forEach((result: string) => {
                    if (new RegExp("[0-9]").test(result))
                        resultWithNumbers.push(result)
                    else
                        resultWithoutNumbers.push(result);
                })

                // Check if any contains EX RAID GYM
                var exRaidGym: boolean = resultWithoutNumbers.filter(x => x == "EX RAID GYM").length == 1
                if (exRaidGym) {
                    resultWithoutNumbers = resultWithoutNumbers.filter(result => result != "EX RAID GYM")
                }
                // Check if any is a pokemon name <- means if we find a match the egg is already hatched
                var pokemonMatch: any = null;
                var gymName = ""

                resultWithoutNumbers.forEach((textResult: string) => {
                    if (pokemonMatch == null) {
                        var resultLowerCased: string = textResult.normalize().toLowerCase();
                        var resultProperlyFormatted = ""

                        // Need to loop because the text reader shows h as russian look-a-like
                        while (resultLowerCased.length != resultProperlyFormatted.length) {
                            resultLowerCased.split("").forEach((character: string) => {
                                if (character == "н") {
                                    resultProperlyFormatted = resultProperlyFormatted + "h"
                                } else if (character == "e") {
                                    resultProperlyFormatted = resultProperlyFormatted + "e"
                                } else {
                                    resultProperlyFormatted = resultProperlyFormatted + character
                                }
                            })
                        }
                        if (pokemonMatch == null) {
                            arrayWithGenerations.forEach((generation: any) => {
                                if (pokemonMatch == null) {
                                    generation.pokemon_species.forEach((mon: any) => {
                                        if (mon.name === resultProperlyFormatted) {
                                            pokemonMatch = resultProperlyFormatted
                                        }
                                    })
                                }
                            })
                        }
                    }
                })

                var timeLeft = resultWithNumbers.filter(x => TextValidator.hasNthOccurencesOf(x, ":") == 2)[0].substring(0, 8)

                var isHatched = !isNull(pokemonMatch)

                var gymName = ""

                if (isHatched) {
                    // asume the gym name is above the pokemon name
                    // const isMatch = (element: string) => element.toLowerCase() === pokemonMatch.toLowerCase();
                    var findRes = resultWithoutNumbers.filter(x=> x.indexOf(pokemonMatch.substring(2)) > -1)[0]
                    gymName = resultWithoutNumbers[resultWithoutNumbers.indexOf(findRes) - 1]
                    
                } else {
                    // First case [0] is A part of the name [1] is the rest of the name [2] is distance alert
                    // Second case [0] is the name [1] is random shiiiet and [2] is the distance 
                    // Third case [0] is the name [1] is empty stringk
                    // Fourth case [0] is the name [1] is random shieeeet and [2] is the distance alert
                    // gunna tak [0] as the name of the gym if not hatched 
                    gymName = resultWithoutNumbers[0];
                }

                var tiers = [0]

                var ino = new GymInfo([gymName, pokemonMatch, timeLeft])

                if (isHatched)
                    returnMessage = `A ${ino.pokemon}(T${tiers.length}) was posted at the gym: ${gymName}.\nIt disapears at ${ino.dtEnd}`;
                else
                    returnMessage = `A T${tiers.length} Egg was posted at the gym: ${gymName}. It hatches at ${ino.dtEnd}`;

                this.handleSuccess(message, returnMessage, uuidv4(), new Date(), "gymName", "pokemonName", isHatched, tiers.length);
            })
    }

    private static async handleError(message: Message, error: string): Promise<void> {
        message.author.send(error);
        message.delete();
    }
    private static async handleSuccess(message: Message, returnMessage: string, guid: string, dateEnd: Date, gymName: string, pokemonName: string, isHatched: boolean, tiers: number) {
        var store: RaidStore = new RaidStore();
        await store.insert({
            Guid: guid,
            DateEnd: dateEnd,
            GymName: gymName,
            PokemonName: pokemonName,
            IsHatched: isHatched,
            Tiers: tiers
        });
        (message.guild.channels.get('655418834358108220') as TextChannel).send(returnMessage)
    }
}