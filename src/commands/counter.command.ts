import { MessageHandler } from "discord-message-handler";
import { Infra } from "../models/infra.class";
import { Message } from "discord.js";
import { PokemonService } from "../services/pokemon.service";
import { dependencyInjectionContainer } from "../di-container";
import { MessageService } from "../services/message.service";

export class CounterCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!counter")
            .minArgs(1)
            .whenInvalid(Infra.WrongCounterCommand())
            .do((args: string[], rawArgs: string, message: Message) => {
                var pokemonService = dependencyInjectionContainer.get(PokemonService)
                let messageService: MessageService = dependencyInjectionContainer.get(MessageService)

                if(args.length == 1) {
                    var pokemon = pokemonService.searchPokemonCounter(args[0])[0]
                    messageService.handlePokemonCounterMessage(pokemon)
                } else if (args.length == 2) {
                    message.delete()
                    message.channel.send("Not implemented")
                } else {
                    message.delete()
                    message.channel.send("Not implemented")
                }
            })
    }
}