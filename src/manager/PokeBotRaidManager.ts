import { Message, MessageReaction, User } from 'discord.js'
import { IPlayer } from "../interfaces/IPlayer"
import { IRaid } from "../interfaces/IRaid"
import { injectable } from 'inversify'
import "reflect-metadata"
import { isNullOrUndefined } from 'util'
import { Player } from '../models/Player'
import { Raid } from '../models/Raid'

const additionsEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']

@injectable()
export class PokeBotRaidManager {

    raids: IRaid[] = [];

    constructor() {
    }
    getUser(messageId: string, userId: string) {
        return this.getRaid(messageId).players.filter((x: IPlayer) => x.id === userId)[0];
    }
    getRaid(messageId: string) {
        return this.raids.filter(raid => raid.messageId === messageId)[0];
    }
    getPlayerFromRaid(raid: IRaid, userId: string) {
        return raid.players.filter(player => player.id === userId)[0];
    }
    isValidAdditionEmoji(emoji: string) {
        return additionsEmojis.filter((emojeh: string) => emojeh === emoji).length === 1;
    }
    deletePlayerFromRaid(messageId: string, userId: string): void {
        var raid = this.getRaid(messageId);
        var player = this.getPlayerFromRaid(raid, userId);
        delete raid.players[raid.players.findIndex((raidPlayer: IPlayer) => raidPlayer.id == player.id)];
    }
    resetPlayerAdditions(messageId: string, userId: string) {
        this.getUser(messageId, userId).additions = 0;
    }
    addPlayerAddition(messageId: string, userId: string, emoji: string) {
        this.getUser(messageId, userId).additions = additionsEmojis.indexOf(emoji) + 1;
    }
    addPlayerToRaid(reaction: MessageReaction, user: User) {
        this.getRaid(reaction.message.id)
            .players.push(new Player(user.id, reaction.message.guild.members.get(user.id)!.displayName));
    }
    createRaid(messageId: string, raidTitle: string) {
        this.raids.push(new Raid(messageId, raidTitle, [], new Date()));
    }
    async removeUserAdditionEmojis(reaction: MessageReaction, user: User) {
        if (reaction.emoji.name == "👍") {
            return
        }
        if (additionsEmojis.indexOf(reaction.emoji.name) == -1 && reaction.emoji.name != '👍') {
            return await reaction.remove(user)
        }
        var number = additionsEmojis.indexOf(reaction.emoji.name) + 1
        if (this.getPlayerFromRaid(this.getRaid(reaction.message.id), user.id).additions != number) {
            var dontDelete = reaction.message.reactions.filter(x => x.emoji.name === '👍' || x.emoji.name === reaction.emoji.name)

            reaction.message.reactions.forEach(reactie => {
                if (dontDelete.filter(x => x.emoji.name === reactie.emoji.name).values.length == 0) {
                    if (reactie.emoji.name != '👍' && reactie.emoji.name != reaction.emoji.name) {
                        reactie.remove(user);
                    }
                }
            })
        }
    }
    findDisplayName(message: Message) {
        return message.guild.members.find(x => x.id === message.author.id).displayName;
    }
    async createRaidResponseMessage(reaction: MessageReaction) {
        var raidWithPlayersString = '';
        this.raids.forEach((raid: IRaid) => {
            if (raid.messageId === reaction.message.id) {
                raidWithPlayersString += `${raid.messageTitle}`;
                raid.players.forEach((player: IPlayer) => {
                    raidWithPlayersString += `\n${player.name}`;
                    raidWithPlayersString += player.additions > 0 ? ` +${player.additions}` : '';
                });
            }
        });
        await reaction.message.edit(raidWithPlayersString);
    }
}
