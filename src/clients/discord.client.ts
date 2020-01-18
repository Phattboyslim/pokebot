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
import { GoogleCloudClient } from "../services/google-cloud-vision.client";
var moment = require("moment")

const allowedChannels: string[] = [ChannelIds.Welcome.toString(), ChannelIds.RaidRoeselare.toString(), ChannelIds.RaidIzegem.toString()]

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
        this.client.on('message', async (message: Message) => {
            if (message.type === "GUILD_MEMBER_JOIN") {
                var guildMemberId = message.author.id
                if (!isNullOrUndefined(guildMemberId)) {
                    var fakeMessage = message
                    fakeMessage.content = "GUILD_MEMBER_JOIN"
                    this.messageService.setMessage(fakeMessage)
                    if (allowedChannels.some(x => x === message.channel.id)) {
                        await this.handler.handleMessage(message)
                    }
                }
            } else if (message.type === "DEFAULT") {
                if (message.content.indexOf("testImg") > -1) {
                    var returnMessage = "Ti etwa hjil skjif gegoan"
                    var client = new GoogleCloudClient()
                    var attachment = message.attachments.first();
                    if (attachment.url != null && attachment.url != "") {
                        var result = await client.readImage(attachment.url)
                        console.log("Read result:\n", validateTime(result))
                        if (!isNullOrUndefined(result)) {
                            var predictionResult = await client.readImageML(attachment.url);
                            if (!isNullOrUndefined(predictionResult)) {
                                var tiers = `Tiers: ${predictionResult.payload.filter((x: any) => x.displayName === "tier").length}`;
                                returnMessage = JSON.stringify({ result: result, tiers: tiers })
                            } else {
                                returnMessage = "Kon de afbeelding niet lezen."
                            }
                        } else {
                            returnMessage = "Kon geen tekst lezen."
                        }
                    } else {
                        returnMessage = "Kon geen afbeelding vinden."
                    }
                    message.channel.send(returnMessage)
                } else {
                    this.messageService.setMessage(message)
                    if (allowedChannels.some(x => x === message.channel.id)) {
                        await this.handler.handleMessage(message)
                    }
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
function foo() {
    return true
}
export function validateTime(lines: string[]) {
    var stringArray = new StringArray(lines)
    var itemIndexFromEnd = 1
    var retries = lines.length
    var isValid = false;
    var date = moment.utc().add(1, 'hours'); // for the belgium local time
    while (retries-- > 0 && !isValid && itemIndexFromEnd++ < 5) {
        var selectedItem = stringArray.getNthFromLast(itemIndexFromEnd)
        console.log(`Validating: ${selectedItem}`)
        if (ValidationRules.hasNthOccurencesOf(selectedItem, ':') == 2) {
            var arrayWithTimeNumbers = selectedItem.split(':')
            var hours = Number(arrayWithTimeNumbers[0])
            var minutes = Number(arrayWithTimeNumbers[1])
            var seconds = Number(arrayWithTimeNumbers[2])
            console.log(`Adding:\nHours: ${hours}\nMinutes: ${minutes}\nSeconds: ${seconds}`)
            date.add(hours, 'hours')
            date.add(minutes, 'minutes')
            date.add(seconds, 'seconds')
            isValid = true
        }
    }
    return moment.utc().endOf(date).fromNow()
}

export class StringArray extends Array<string> {
    private _array: Array<string>
    constructor(array: Array<string>) {
        super()
        this._array = array
    };
    get last() {
        return this._array[this._array.length - 1]
    }

    getNthFromLast(nth: number) {
        return this._array[this._array.length - nth]
    }

    hasEqualLengthStrings() {
        const firstLengthValue = this._array[0].length
        this._array.forEach(string => {
            if (string.length != firstLengthValue) {
                return false
            }
        })
        return true
    }
}

export class ValidationRules {

    static hasNthOccurencesOf(input: string, match: string) {
        var count = 0
        for (var i = 0; i < input.length; i++) {
            if (input.charAt(i) === match) {
                count++
            }
        }
        return count
    }
    static isTimeLeft(input: string) {
        return input.match("[:]")?.length == 2
    }
}