import { IMessageService } from "../interfaces/IMessageService";
import { Message } from "discord.js";
import { isNullOrUndefined } from "util";
import { injectable } from "inversify";
import "reflect-metadata"

const botId = '623828070062620673'

@injectable()
export class MessageService implements IMessageService {
    private message: Message | null = null

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

    handleRaidStart() {
        var response = ""
        if (["631914851710533642", "631624476173533184", "631726419243696128"].some(x => x === this.message!.channel.id)) {
            response = "🗡️ " + this.commandArguments.splice(2).join(' ') + " 🗡️";
            this.message!.channel.send(response);
        } else {
            response = "This command only works in raid channels\n"
            this.message!.author.send(response);
        }
        this.message!.delete();
    }

    handleHelpRequest() {
        var response = "Vroaget an mi aj ulpe nodig et 😂😂😂😂";
        this.message!.author.send(response);
        this.message!.delete();
    }

    async handlePurgeRequest() {
        await this.message!.channel.fetchMessages({ limit: Number(this.message!.content.split(' ')[3].substring(1)) }).then(messages => {
            var filterMessages = messages.filter(x => x.content.indexOf("🗡️") == -1)
            filterMessages.forEach(async msg => {
                if (msg.author.id != botId) {
                    await msg.delete()
                }
            })
        })
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

    handleSetChannelTopic() {
        this.message!.guild.channels.filter(chan => chan.id === this.message!.channel.id).first().setTopic(this.commandArguments.slice(2).join(" "));
    }

    async handleSetPinnedMessage() {
        var content = `📌 ${this.commandArguments.slice(2).join(" ")} `
        await this.message!.delete();
        await this.message!.channel.send(content)
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