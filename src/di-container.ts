// file inversify.config.ts

import { Container } from "inversify";
import { PokeBotRaidManager } from "./manager/PokeBotRaidManager"
import { MessageService } from "./services/message.service";

const dependencyInjectionContainer = new Container();
dependencyInjectionContainer.bind<PokeBotRaidManager>(PokeBotRaidManager).toSelf();
dependencyInjectionContainer.bind<MessageService>(MessageService).toSelf();
export { dependencyInjectionContainer };