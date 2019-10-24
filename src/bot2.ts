console.log('Hello world!')
import { Client, TextChannel, Message, Channel } from 'discord.js'
import { isNullOrUndefined } from 'util'
import { MessageHandler } from 'discord-message-handler'
import { GreetingCommands, RaidCommands } from './GreetingCommands'
// import { MessageHandler } from 'discord-message-handler'
export enum ChannelIds {
    Welcome = "632880237964951572"
}

const allowedChannels: string[] = [ChannelIds.Welcome.toString()]

export class DiscordClient {
    auth = require('../src/auth')
    // Initialize Discord Bot
    client: Client = new Client()
    handler: MessageHandler
    // handler: MessageHandler = new MessageHandler();
    channels: TextChannel[] = []
    constructor() {
        this.handler = new MessageHandler();
        GreetingCommands.setup(this.handler);
        RaidCommands.setup(this.handler)
    }

    login() {
        this.client.login(this.auth.token)
    }
    onReady() {
        this.client.on('ready', async () => {
            console.log(`Logged in as ${this.client.user.tag}!`)
            var channel = this.getChannelById(ChannelIds.Welcome) as TextChannel
            if (!isNullOrUndefined(channel)) {
                this.channels.push(channel)
            }
            console.log(this.channels)
        })
    }
    onMessage() {
        this.client.on('message', (message: Message) => {
            if (allowedChannels.some(x => x === message.channel.id)) {
                this.handler.handleMessage(message)
            }
            console.log(message)
        })
    }
    getChannelById(id: string) {
        return this.client.channels.get(id);
    }
}

var client = new DiscordClient()
client.login()
client.onReady();
client.onMessage();