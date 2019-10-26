import { DiscordClient } from './clients/discord.client';

// Setup Environment
import * as dotenv from "dotenv"
dotenv.config()
const token = process.env.APP_SETTING_TOKEN || ""

// Setup DiscordClient
var client = new DiscordClient(token)
client.login()
client.onReady();
client.onMessage();
client.onMessageReactionAdd();
client.onMessageReactionRemove();