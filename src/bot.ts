import { DiscordClient } from './clients/discord.client';

// Setup Environment
import * as dotenv from "dotenv"
dotenv.config()

// Setup DiscordClient
var client = new DiscordClient()
client.login()
client.onReady();
client.onMessage();
client.onMessageReactionAdd();
client.onMessageReactionRemove();