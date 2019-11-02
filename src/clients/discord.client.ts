import { Client, TextChannel, Message, MessageReaction, User } from "discord.js";
import { MessageHandler } from "discord-message-handler";
import { MessageReactionHandler } from "../handlers/message.reaction.handler";
import { MessageService } from "../services/message.service";
import { dependencyInjectionContainer } from "../di-container";
import { RaidCommand } from "../commands/raid.command";
import { RegisterRankCommand } from "../commands/register.command";
import { isNullOrUndefined } from "util";
import { ChannelIds } from "../models/channelIds.enum";
import { CounterCommand } from "../commands/counter.command";
const allowedChannels: string[] = [ChannelIds.Welcome.toString(), ChannelIds.RaidRoeselare.toString(), ChannelIds.RaidIzegem.toString()]

export class DiscordClient {

    client: Client = new Client()
    handler: MessageHandler = new MessageHandler()
    messageReactionHandler: MessageReactionHandler = new MessageReactionHandler()
    messageService: MessageService = dependencyInjectionContainer.get(MessageService)

    channels: TextChannel[] = []
    private token: any
    constructor(token: any) {
        RaidCommand.setup(this.handler)
        RegisterRankCommand.setup(this.handler)
        CounterCommand.setup(this.handler)
        this.token = token
    }

    login() {
        this.client.login(this.token)
    }
    onReady() {
        this.client.on('ready', async () => {
            console.log(`Logged in as ${this.client.user.tag}!`)
            var channel = this.getChannelById(ChannelIds.Welcome) as TextChannel
            if (!isNullOrUndefined(channel)) {
                this.channels.push(channel)
            }
        })
    }
    onMessage() {
        this.client.on('message', async (message: Message) => {
            this.messageService.setMessage(message)
            if (allowedChannels.some(x => x === message.channel.id)) {
                await this.handler.handleMessage(message)
            }
        })
    }
    onMessageReactionAdd() {
        this.client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
            if (allowedChannels.some(x => x === reaction.message.channel.id)) {
                this.messageReactionHandler.handleAdd(reaction, user)
            }
        })
    }
    onMessageReactionRemove() {
        this.client.on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
            if (allowedChannels.some(x => x === reaction.message.channel.id)) {
                this.messageReactionHandler.handleRemove(reaction, user)
            }
        })
    }
    getChannelById(id: string) {
        return this.client.channels.get(id);
    }
}