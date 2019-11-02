import { IMessageService } from "../interfaces/messag.service.interface";
import { Message, RichEmbed } from "discord.js";
import { isNullOrUndefined } from "util";
import { injectable } from "inversify";
import "reflect-metadata"
import { ChannelIds } from "../models/channelIds.enum";
import { Raid } from "../models/raid.class";
import { PokemonCounter } from "./pokemon.service";

const botId = '623828070062620673'
const additionsEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']
const allowedChannels: string[] = [ChannelIds.RaidRoeselare.toString(), ChannelIds.RaidIzegem.toString()]
const raidingInfo = `Reageer met 👍 om te joinen\nReageer met:\n${additionsEmojis.join(' ')}\nom aan te geven dat je extra accounts of spelers mee hebt.`
@injectable()
export class MessageService implements IMessageService {
    public message: Message | null = null

    setMessage(message: Message) {
        this.message = message
    }

    get commandSymbol() {
        return this.message!.content.substring(0, 1)
    }
    get commandArguments() {
        return this.message!.content
            .substring(['!', '?'].some(x => x === this.commandSymbol) ? 1 : 0)
            .split(' ')
            .filter(Boolean)
    }
    findDisplayName(message: Message) {
        return message.guild.members.find(x => x.id === message.author.id).displayName;
    }
    async handleRaidStart() {
        var response = ""
        this.message!.delete();
        // set the raids to only work in specific channels
        if (allowedChannels.some(x => x === this.message!.channel.id)) {
            let richEmbed = new RichEmbed()
                .setTitle(`🗡️ ${this.commandArguments.splice(2).join(' ')} 🗡️ Started by: ${this.findDisplayName(this.message!)}`)
                .setDescription(raidingInfo)
                .setThumbnail("https://pokemongohub.net/wp-content/uploads/2019/10/darkrai-halloween.jpg")
                .setColor("#31d32b")

            await this.message!.channel.send(richEmbed);
        } else {
            response = "This command only works in raid channels\n"
            this.message!.author.send(response);
        }
    }

    async handlePokemonCounterMessage(data: PokemonCounter) {
        var response = ""
        this.message!.delete();
        data.counters.forEach(x=> {
            response += `${x.name}\nAttacks: ${x.attacks.join(" & ")}\n\n`
        })
        // set the raids to only work in specific channels
        // if (allowedChannels.some(x => x === this.message!.channel.id)) {
            let richEmbed = new RichEmbed()
                .setTitle(`Counters for ${data.name}`)
                .setDescription(response)
                .setThumbnail(data.thumbnail)
                .setColor("#31d32b")

            await this.message!.channel.send(richEmbed);
        // } else {
        //     response = "This command only works in raid channels\n"
        //     this.message!.author.send(response);
        // }
    }

    async handleRankRequest() {
        var firstName = this.commandArguments[2]
        var playerName = this.commandArguments[3]
        var level = Number(this.commandArguments[4])
        var role = this.message!.guild.roles.filter(x => x.name.toLowerCase() == this.commandArguments[1].toLowerCase()).first()
        var emoji = EmojiHelper.getEmoji(role.name.toLowerCase())
        var user = this.message!.guild.members.get(this.message!.author.id)
        var bot = this.message!.guild.members.get(botId)
        if (!isNullOrUndefined(user) && !isNullOrUndefined(role)) { // if user exists 
            if (isNullOrUndefined(role.members.filter(x => x.id === user!.id).first())) { // if user does not have role
                await user.addRole(role)
            }
            try {
                await this.message!.delete()
                this.message!.guild.members.get(user.id)!.setNickname(`${firstName}|${playerName}|${emoji}|${level}`)
            } catch (error) {
                console.log(error)
            }
        }
    }

    async handleLevelUpRequest() {
        var name = this.message!.guild.members.filter(m => m.id === this.message!.author.id).first().nickname
        var nickNameArguments = name.split('|')
        nickNameArguments[3] = (Number(nickNameArguments[3]) + 1).toString()
        this.message!.guild.members.get(this.message!.author.id)!.setNickname(`${nickNameArguments.join('|')}`)
    }
}
export enum RankEmoji {
    "valor" = "🔥",
    "mystic" = "💧",
    "instinct" = "⚡"
}
export class EmojiHelper {
    static getEmoji(name: string) {
        switch (name) {
            case "valor": return RankEmoji.valor
            case "mystic": return RankEmoji.mystic
            case "instinct": return RankEmoji.instinct
        }
    }
}