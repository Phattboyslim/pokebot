import { MessageHandler } from "discord-message-handler";
import { Message } from "discord.js";
import { isNullOrUndefined } from "util";
import { validatePokemonName, validateName, validateTime } from "../clients/discord.client";
import { GoogleCloudClient } from "../services/google-cloud-vision.client";
import { dependencyInjectionContainer } from "../di-container";
import { ChannelIds } from "../models/channelIds.enum";

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
                    message.author.send("Something went wrong")
                    message.delete();
                    return
                }
                var textResult = await client.readImage(attachment.url)
                if (isNullOrUndefined(textResult)) {
                    message.author.send("Something went wrong")
                    message.delete();
                    return
                }
                var pokemonName = validatePokemonName(textResult); var gymName = validateName(textResult); var timeLeft = validateTime(textResult)
                if (isNullOrUndefined(pokemonName) || isNullOrUndefined(gymName) || isNullOrUndefined(timeLeft)) {
                    message.author.send("Something went wrong")
                    message.delete();
                    return
                }
                var imageResult = await client.readImageML(attachment.url);
                if (isNullOrUndefined(imageResult)) {
                    message.author.send("Something went wrong")
                    message.delete();
                    return
                }
                var tiers = imageResult.payload.filter((x: any) => x.displayName === "tier");
                if (isNullOrUndefined(tiers)) {
                    message.author.send("Something went wrong");
                    message.delete();
                    return
                }
                returnMessage = `A ${pokemonName}(T${tiers.length}) was posted at the gym: ${gymName}.\nIt disapears in ${timeLeft.split('.')[0]} minutes`
                message.channel.send(returnMessage)
            })
    }
}