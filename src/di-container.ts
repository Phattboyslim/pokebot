// file inversify.config.ts

import { Container } from "inversify";
import { RaidService } from "./services/raid.service"
import { MessageService } from "./services/message.service";
import { PokemonService } from "./services/pokemon.service";
import { ImageAnnotatorClient } from "./services/ImageAnnotatorClient";

const dependencyInjectionContainer = new Container();
dependencyInjectionContainer.bind<RaidService>(RaidService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<PokemonService>(PokemonService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<MessageService>(MessageService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<ImageAnnotatorClient>(ImageAnnotatorClient).toSelf().inSingletonScope()
export { dependencyInjectionContainer };