import { MessageHandler } from 'discord-message-handler'
import { Message } from 'discord.js';
import { Player } from '../models/player.class';
import { MessageService } from '../services/message.service';
import { dependencyInjectionContainer } from '../di-container';
const botId = '623828070062620673'

export class RegisterRankCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!register")
            .minArgs(1)
            .matches(Player.RegisterRankCommandRegularExpression())
            .whenInvalid(Player.RegisterRankCommandInvalidMessage())
            .do((args: string[], rawArgs: string, message: Message) => {
                var botUser = message.guild.members.filter(x => x.id === botId).first()
                if (botUser.hasPermission("MANAGE_NICKNAMES") && botUser.hasPermission("MANAGE_ROLES") && botUser.hasPermission("CHANGE_NICKNAME")) {
                    let messageService: MessageService = dependencyInjectionContainer.get(MessageService)
                    messageService.handleRankRequest();
                }
            })
    }
}