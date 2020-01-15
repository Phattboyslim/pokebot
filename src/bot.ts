import { DiscordClient } from './clients/discord.client';

// Setup Environment
import * as dotenv from "dotenv"
dotenv.config()
const token = "NjU1NDExNzUxNzA5MzEwOTk5.XfTt8Q.gjakFj8LXQNr9r20Yb5PFerCmD4"

// Setup DiscordClient
var client = new DiscordClient(token)
client.login()
client.onReady();
client.onMessage();
client.onMessageReactionAdd();
client.onMessageReactionRemove();