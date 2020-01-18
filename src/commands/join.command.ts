import { MessageHandler } from 'discord-message-handler'
import { Message } from 'discord.js';

export class JoinCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("GUILD_MEMBER_JOIN")
            .minArgs(0)
            .do((args: string[], rawArgs: string, message: Message) => {
                message.author.send("Ahn yeet")
            })
    }
}
