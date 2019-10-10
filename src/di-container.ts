// file inversify.config.ts

import { Container } from "inversify";
import { PokeBotRaidManager } from "./manager/PokeBotRaidManager"

const dependencyInjectionContainer = new Container();
dependencyInjectionContainer.bind<PokeBotRaidManager>(PokeBotRaidManager).toSelf();
export { dependencyInjectionContainer };