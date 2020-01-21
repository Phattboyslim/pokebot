// file inversify.config.ts

import { Container } from "inversify";
import { RaidService } from "./services/raid.service"
import { MessageService } from "./services/message.service";
import { PokemonService } from "./services/pokemon.service";
import { GoogleCloudServices } from "./services/google-cloud.services";
import { GoogleCloudClient } from "./services/google-cloud-vision.client";
import { PokemonStore } from "./stores/pokemon.store";
import { RaidStore } from "./stores/raid.store";
import { TextValidator } from "./clients/text.validator";

const dependencyInjectionContainer = new Container();
// Services
dependencyInjectionContainer.bind<RaidService>(RaidService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<PokemonService>(PokemonService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<MessageService>(MessageService).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<GoogleCloudServices>(GoogleCloudServices).toSelf().inSingletonScope()

// Clients
dependencyInjectionContainer.bind<GoogleCloudClient>(GoogleCloudClient).toSelf().inSingletonScope();

// Stores
dependencyInjectionContainer.bind<RaidStore>(RaidStore).toSelf().inSingletonScope();
dependencyInjectionContainer.bind<PokemonStore>(PokemonStore).toSelf().inSingletonScope();

// Misc
dependencyInjectionContainer.bind<TextValidator>(TextValidator).toSelf().inSingletonScope();
export { dependencyInjectionContainer };