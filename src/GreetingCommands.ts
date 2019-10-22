import { MessageHandler } from 'discord-message-handler'
export class GreetingCommands {
    static setup(handler: MessageHandler) {
        handler.whenMessageContainsExact("Yo").reply("Yeet");
    }
}
