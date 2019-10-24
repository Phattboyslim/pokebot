import { MessageHandler } from 'discord-message-handler'
import { Message } from 'discord.js';
export class GreetingCommands {
    static setup(handler: MessageHandler) {
        handler.whenMessageContainsExact("Yo").reply("Yeet");
    }
}

export class RaidCommands {
    static setup(handler: MessageHandler) {
        handler.onCommand("!raid")
            .minArgs(5)
            .matches("(start)( )([Tt])([1-5]{1})(( \\w+){1,4})( )(0{2}|([0-9]|1[0-9]|2[0-3]))([Uu]|\\:)(0{2}|([0-5][0-9]))")
            .whenInvalid("Geen geldig raid commando!")
            .do((args: string[], rawArgs: string, message: Message) => {
                console.log("Args: ", args)
                console.log("Raw args: ", rawArgs)
                console.log("Message: ", message)
            })
    }
}