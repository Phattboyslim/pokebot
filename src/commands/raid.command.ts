import { MessageHandler } from 'discord-message-handler'
import { Message } from 'discord.js';
import { Raid } from '../models/raid.class';
import { dependencyInjectionContainer } from '../di-container';
import { MessageService } from '../services/message.service';
import { RaidService, PokeBotErrors } from '../services/raid.service';

export class RaidCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!raid")
            .minArgs(5)
            .matches(Raid.RaidCommandRegularExpression())
            .whenInvalid(Raid.RaidCommandInvalidErrorMessage())
            .do( async (args: string[], rawArgs: string, message: Message) => {
                var messageService: MessageService = dependencyInjectionContainer.get(MessageService)
                await messageService.handleRaidStart()
                var raidService: RaidService = dependencyInjectionContainer.get(RaidService)
                let embeds = messageService.message!.embeds
                if (embeds && embeds.length > 0 && embeds[0].title.indexOf("🗡️") > -1) {
                   var createdRaidResult = await raidService.createRaid(messageService.message!, embeds[0].title.split(" "), message)
                   switch(createdRaidResult) {
                       case PokeBotErrors.UNDEFINED: {
                    
                       } break;
                       case PokeBotErrors.UNKNOWN: {
                        messageService.message!.delete()
                        messageService.message!.channel.send("Oops, try again!")
                       } break;
                       case PokeBotErrors.WRONG_DATE: {
                        messageService.message!.delete()
                        messageService.message!.channel.send("Oops, wrong date!")
                       } break;
                       default: {
                        messageService.message!.delete()
                        messageService.message!.channel.send("Oops, try again!")
                       } break;
                   }
                }
            })
    }
}