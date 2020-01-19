import { MessageHandler } from "discord-message-handler";
import { Message, TextChannel } from "discord.js";
import { isNullOrUndefined } from "util";
import { GoogleCloudClient } from "../services/google-cloud-vision.client";
import { dependencyInjectionContainer } from "../di-container";
import { ChannelIds } from "../models/channelIds.enum";
import { ValidationRules } from "../clients/ValidationRules";
import { Raid, RaidStore } from "../stores/raid.store";
const moment = require("moment");
export class ScanRaidImageCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!scan")
            .minArgs(0)
            .whenInvalid("Tis ni juste")
            .do(async (args: string[], rawArgs: string, message: Message) => {
                var returnMessage = "Ti etwa hjil skjif gegoan"
                var client: GoogleCloudClient = dependencyInjectionContainer.get<GoogleCloudClient>(GoogleCloudClient)
                if(isNullOrUndefined(client)) {
                    message.author.send("Something went wrong. Please try again. If this problem persists, please contact support.")
                    message.delete();
                    return
                }
                if (message.channel.id != ChannelIds.RaidScanChannel.toString()) {
                    message.author.send("You are not allowed to do this here!")
                    message.delete();
                    return
                }
                var attachment = message.attachments.first();
                if (isNullOrUndefined(attachment.url) && attachment.url != "") {
                    message.author.send("Something went wrong fetching attachement url. Please try again. If this problem persists, please contact support.")
                    message.delete();
                    return
                }
                var textResult = await client.readImage(attachment.url)
                if (isNullOrUndefined(textResult)) {
                    message.author.send("Something went wrong getting text result from your image. Please try again. If this problem persists, please contact support.")
                    message.delete();
                    return
                }
                var pokemonName = ValidationRules.validatePokemonName(textResult); var gymName = ValidationRules.validateName(textResult); var timeLeft = ValidationRules.validateTime(textResult)
                if (isNullOrUndefined(gymName) || isNullOrUndefined(timeLeft)) {
                    message.author.send("Something went wrong sorting the text from the text result scan. Please try again. If this problem persists, please contact support.")
                    message.delete();
                    return
                }
                var isHatched = false
                if(!isNullOrUndefined(pokemonName) && pokemonName.trim() != "") {
                    isHatched = true
                }

                var imageResult = await client.readImageML(attachment.url);
                if (isNullOrUndefined(imageResult)) {
                    message.author.send("Something went wrong getting an image scan result. Please try again. If this problem persists, please contact support.")
                    message.delete();
                    return
                }
                var tiers = imageResult.payload.filter((x: any) => x.displayName === "tier");
                if (isNullOrUndefined(tiers)) {
                    message.author.send("Something went wrong fetching tiers from image. Please try again. If this problem persists, please contact support.");
                    message.delete();
                    return
                }
                if(isHatched)
                    returnMessage = `A ${pokemonName}(T${tiers.length}) was posted at the gym: ${gymName}.\nIt disapears in ${timeLeft.toString().split('.')[0]} minutes`;
                else
                    returnMessage = `A T${tiers.length} Egg was posted at the gym: ${gymName}. It hatches in ${timeLeft.toString().split('.')[0]} minutes`;
                
                var raid: Raid = new Raid();
                raid.DateEnd = moment.utc().add(1, 'hours').add(Number(timeLeft.toString().split('.')[0]), 'minutes');
                raid.GymName = gymName;
                raid.IsHatched = isHatched;
                raid.PokemonName = pokemonName;
                raid.Tiers = tiers
                var store: RaidStore = new RaidStore();
                store.insert(raid)

                (message.guild.channels.get('655418834358108220') as TextChannel).send(returnMessage)
            })
    }
}