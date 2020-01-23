import { Message } from "discord.js";
import { isNullOrUndefined } from "util";

export class DiscordHelper { 
    static findDisplayName(message: Message) {
        return message.guild.members.find(x => x.id === message.author.id).displayName;
    }
    static findDisplayAvatar(message: Message) {
        return message.guild.members.find(x => x.id === message.author.id).user.avatarURL ? message.guild.members.find(x => x.id === message.author.id).user.avatarURL : "https://www.shareicon.net/data/128x128/2015/09/21/644252_question_512x512.png"
    }
    static findDisplayUserRoleColor(message: Message) {
        var member = message.guild.members.find(x => x.id === message.author.id)
        if(!isNullOrUndefined(member)) {
            var colorRole = member.colorRole
            if(!isNullOrUndefined(colorRole)){
                return colorRole.hexColor
            }
        }
        return "#0084FF"
    }
}