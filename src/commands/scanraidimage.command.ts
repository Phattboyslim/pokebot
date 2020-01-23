import { MessageHandler } from "discord-message-handler";
import { Message, TextChannel, RichEmbed } from "discord.js";
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
import { DiscordHelper } from "../helpers/discord.helper";
const arrayWithGenerations: any[] = [pokemon.gen1, pokemon.gen2, pokemon.gen3, pokemon.gen4, pokemon.gen5];
var uuidv4 = require('uuid/v4')
export class ScanRaidImageCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!scan")
            .minArgs(1)
            .matches('([a-z]|[A-Z])([1-5]{1})')
            .whenInvalid("Heb je vergeten de T1-5 toe te voegen?")
            .do(async (args: string[], rawArgs: string, message: Message) => {
                var returnMessage: RichEmbed | string = "Ti etwa hjil skjif gegoan"
                var client: GoogleCloudClient = dependencyInjectionContainer.get<GoogleCloudClient>(GoogleCloudClient)
                var pokemonStore: PokemonStore = dependencyInjectionContainer.get<PokemonStore>(PokemonStore)

                var tiers = 0
                if(!isNullOrUndefined(args) && !isNullOrUndefined(args[0]) && args[0].length === 2) {
                    tiers = Number([args[0][1]])
                }
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
                var textResults: string[] | null = await client.readImage(attachment.url)
                if (isNullOrUndefined(textResults)) {
                    return this.handleError(message, "Something went wrong getting text result from your image. Please try again. If this problem persists, please contact support.")
                }

                var resultWithNumbers: any[] = []
                var resultWithoutNumbers: any[] = []

                // Split arrays into string with and without numbers
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

                resultWithoutNumbers.forEach((textResult: string) => {
                    if (pokemonMatch == null) {
                        var resultLowerCased: string = textResult.toLowerCase();
                        // checking each generation their pokemon_species
                        if (pokemonMatch == null) {
                            arrayWithGenerations.forEach((generation: any) => {
                                if (pokemonMatch == null) {
                                    // checking every pokemon in that generation
                                    generation.pokemon_species.forEach((mon: any) => {
                                        if (mon.name === resultLowerCased) {
                                            pokemonMatch = textResult
                                        }
                                    })
                                }
                            })
                        }
                    }
                })

                // Get the time left until hatch or disapear
                var timeLeft = resultWithNumbers.filter(x => TextValidator.hasNthOccurencesOf(x, ":") == 2)[0].substring(0, 8)

                // Determine isHatched based on found a pokemon name
                var isHatched = !isNull(pokemonMatch)

                var gymName = ""

                if (isHatched) {
                    // asume the gym name is above the pokemon name
                    var findRes = resultWithoutNumbers.filter(x=> x.indexOf(pokemonMatch.substring(2)) > -1)[0]
                    gymName = resultWithoutNumbers[resultWithoutNumbers.indexOf(findRes) - 1]  
                } else {
                    // in 4 out 5 times it was this first element so taking first
                    gymName = resultWithoutNumbers[0];
                }
                
                var info = new GymInfo([gymName, pokemonMatch, timeLeft])
                returnMessage = new RichEmbed()
                    .setFooter(`${DiscordHelper.findDisplayName(message!)}`, `${DiscordHelper.findDisplayAvatar(message!)}`)
                
                if (isHatched) {
                    returnMessage.setTitle(`T${tiers} - ${info.pokemon}`)
                    returnMessage.setDescription(`Gym: ${info.titel!}.\nIt disapears at ${info.dtEnd}`);
                }
                else {
                    returnMessage.setTitle(`T${tiers} - Unhatched`)
                    returnMessage.setDescription(`Gym: ${info.titel!}.\nIt hatches at ${info.dtEnd}`);
                }

                this.handleSuccess(message, returnMessage, uuidv4(), new Date(), info.titel!, info.pokemon!, isHatched, tiers);
            })
    }

    private static async handleError(message: Message, error: string): Promise<void> {
        message.author.send(error);
        message.delete();
    }
    private static async handleSuccess(message: Message, returnMessage: RichEmbed, guid: string, dateEnd: Date, gymName: string, pokemonName: string, isHatched: boolean, tiers: number) {
        var store: RaidStore = new RaidStore();
        await store.insert({
            Guid: guid,
            DateEnd: dateEnd,
            GymName: gymName,
            PokemonName: pokemonName,
            IsHatched: isHatched,
            Tiers: tiers
        });
        (message.guild.channels.get('655418834358108220') as TextChannel).sendEmbed(returnMessage)
    }
}

