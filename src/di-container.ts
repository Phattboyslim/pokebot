// file inversify.config.ts

import { Container } from "inversify";
import { RaidService } from "./services/raid.service"
import { MessageService } from "./services/message.service";
import { PokemonService } from "./services/pokemon.service";
import { GoogleCloudServices } from "./services/google-cloud.services";
import { GoogleCloudClient } from "./services/google-cloud-vision.client";

const dependencyInjectionContainer = new Container();
dependencyInjectionContainer.bind<RaidService>(RaidService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<PokemonService>(PokemonService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<MessageService>(MessageService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<GoogleCloudServices>(GoogleCloudServices).toSelf().inSingletonScope()
dependencyInjectionContainer.bind<GoogleCloudClient>(GoogleCloudClient).toSelf().inSingletonScope();
export { dependencyInjectionContainer };