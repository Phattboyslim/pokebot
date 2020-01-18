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
import { JoinCommand } from "../commands/join.command"
import { ScanRaidImageCommand } from "../commands/scanraidimage.command";
import { StringArray } from "./StringArray";
import { ValidationRules } from "./ValidationRules";
var moment = require("moment")

const allowedChannels: string[] = [ChannelIds.Welcome.toString(), ChannelIds.RaidRoeselare.toString(), ChannelIds.RaidIzegem.toString(), ChannelIds.RaidScanChannel.toString()]

export class DiscordClient {

    client: Client = new Client()
    handler: MessageHandler = new MessageHandler()
    messageReactionHandler: MessageReactionHandler = new MessageReactionHandler()
    messageService: MessageService = dependencyInjectionContainer.get(MessageService)

    channels: TextChannel[] = []
    constructor() {
        RaidCommand.setup(this.handler)
        RegisterRankCommand.setup(this.handler)
        CounterCommand.setup(this.handler)
        JoinCommand.setup(this.handler)
        ScanRaidImageCommand.setup(this.handler)
    }

    login() {
        this.client.login(process.env.BOT_TOKEN)
    }
    onReady() {
        this.client.on('ready', async () => {
            console.log(`Info: Logged in as ${this.client.user.tag}!`)
            var channel = this.getChannelById(ChannelIds.Welcome) as TextChannel
            if (!isNullOrUndefined(channel)) {
                channel.send("Ah yeet")
                this.channels.push(channel)
            }
        })
    }
    async onMessage() {
        this.client.on('message', (message: Message) => {
            if (message.type === "GUILD_MEMBER_JOIN") {
                var guildMemberId = message.author.id
                console.log(`Member with id: ${guildMemberId} joined discord.`)
            } else if (message.type === "DEFAULT") {
                this.messageService.setMessage(message)
                if (allowedChannels.some(x => x === message.channel.id)) {
                    this.handler.handleMessage(message)
                }
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

