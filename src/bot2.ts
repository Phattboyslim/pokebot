console.log('Hello world!')
import { Client, TextChannel, Message } from 'discord.js'
import { isNullOrUndefined } from 'util'
// import { MessageHandler } from 'discord-message-handler'
export enum ChannelIds {
    Welcome = "632880237964951572"
}
export class DiscordClient {
    auth = require('../src/auth')
    // Initialize Discord Bot
    client: Client = new Client()
    // handler: MessageHandler = new MessageHandler();
    channels: TextChannel[] = []
    constructor() {
    }

    login() {
        this.client.login(this.auth.token)
    }
    async onReady() {
        this.client.on('ready', async () => {
            console.log(`Logged in as ${this.client.user.tag}!`)
            var channel = this.getChannelById(ChannelIds.Welcome) as TextChannel
            if (!isNullOrUndefined(channel)) {
                this.channels.push(channel)
            }
            console.log(this.channels)
        })
    }
    async onMessage() {
        this.client.on('message', async () => {

        })
    }
    getChannelById(id: string) {
        return this.client.channels.get(id);
    }
}
export class MessageService {

}
var client = new DiscordClient()
client.login()
async () => {
    await client.onReady()
        .then(res => {
            console.log(res)
            client.channels[0].send("test")
        });
}