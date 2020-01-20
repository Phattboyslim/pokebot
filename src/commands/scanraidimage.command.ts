import { MessageHandler } from "discord-message-handler";
import { Message, TextChannel } from "discord.js";
import { isNullOrUndefined } from "util";
import { GoogleCloudClient } from "../services/google-cloud-vision.client";
import { dependencyInjectionContainer } from "../di-container";
import { ChannelIds } from "../models/channelIds.enum";
import { ValidationRules } from "../clients/ValidationRules";
import { Raid, RaidStore } from "../stores/raid.store";
var uuidv4 = require('uuid/v4')
export class ScanRaidImageCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!scan")
            .minArgs(0)
            .whenInvalid("Tis ni juste")
            .do(async (args: string[], rawArgs: string, message: Message) => {
                var returnMessage = "Ti etwa hjil skjif gegoan"
                var client: GoogleCloudClient = dependencyInjectionContainer.get<GoogleCloudClient>(GoogleCloudClient)
                if (isNullOrUndefined(client)) {
                    return this.handleError(message, "Something went wrong. Please try again. If this problem persists, please contact support.")

                }
                if (message.channel.id != ChannelIds.RaidScanChannel.toString()) {
                    return this.handleError(message, "You are not allowed to do this here!")
                }
                var attachment = message.attachments.first();
                if (isNullOrUndefined(attachment.url) && attachment.url != "") {
                    return this.handleError(message, "Something went wrong fetching attachement url. Please try again. If this problem persists, please contact support.")
                }
                var textResult = await client.readImage(attachment.url)
                if (isNullOrUndefined(textResult)) {
                    return this.handleError(message, "Something went wrong getting text result from your image. Please try again. If this problem persists, please contact support.")
                }
                var pokemonName = ValidationRules.validatePokemonName(textResult); var gymName = ValidationRules.validateName(textResult); var timeLeft = ValidationRules.validateTime(textResult)
                if (isNullOrUndefined(gymName) || isNullOrUndefined(timeLeft)) {
                    return this.handleError(message, "Something went wrong sorting the text from the text result scan. Please try again. If this problem persists, please contact support.")
                }
                var isHatched = false
                if (!isNullOrUndefined(pokemonName) && pokemonName.trim() != "") {
                    isHatched = true
                }

                var imageResult = await client.readImageML(attachment.url);
                if (isNullOrUndefined(imageResult)) {
                    return this.handleError(message, "Something went wrong getting an image scan result. Please try again. If this problem persists, please contact support.")
                }
                var tiers = imageResult.payload.filter((x: any) => x.displayName === "tier");
                if (isNullOrUndefined(tiers)) {
                    return this.handleError(message, "Something went wrong fetching tiers from image. Please try again. If this problem persists, please contact support.");
                }
                if (isHatched)
                    returnMessage = `A ${pokemonName}(T${tiers.length}) was posted at the gym: ${gymName}.\nIt disapears in ${timeLeft.toString().split('.')[0]} minutes`;
                else
                    returnMessage = `A T${tiers.length} Egg was posted at the gym: ${gymName}. It hatches in ${timeLeft.toString().split('.')[0]} minutes`;
                
                this.handleSuccess(message, returnMessage, uuidv4(), new Date(), gymName, pokemonName, isHatched, tiers);
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