import { MessageHandler } from "discord-message-handler";
import { Infra } from "../models/infra.class";
import { Message } from "discord.js";
import { PokemonService } from "../services/pokemon.service";
import { dependencyInjectionContainer } from "../di-container";
import { MessageService } from "../services/message.service";
import { isNull } from "util";

export class CounterCommand {
    static setup(handler: MessageHandler) {
        handler.onCommand("!counters")
            .minArgs(1)
            .whenInvalid(Infra.WrongCounterCommand())
            .do((args: string[], rawArgs: string, message: Message) => {
                var pokemonService = dependencyInjectionContainer.get(PokemonService)
                let messageService: MessageService = dependencyInjectionContainer.get(MessageService)
                if(args.length == 1) {
                    var searchResult = pokemonService.searchPokemonCounter(args[0])
                    if(!isNull(searchResult)  && searchResult.length > 0) {
                        messageService.handlePokemonCounterMessage(searchResult[0]) // take first
                    } else {
                        message.delete()
                        message.channel.send("Couldnt find that pokemon")
                    }
                } else if (args.length == 2) {
                    message.channel.send("Not implemented")
                } else {
                    message.channel.send("Not implemented")
                }
            })
    }
}