import { Message, MessageReaction, User } from 'discord.js'
import { IPlayer } from "../interfaces/IPlayer"
import { IRaid } from "../interfaces/IRaid"
import { injectable } from 'inversify'
import "reflect-metadata"

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
            .players.push({
                id: user.id,
                name: reaction.message.guild.members.get(user.id)!.displayName,
                additions: 0,
            });
    }
    createRaid(messageId: string, raidTitle: string) {
        this.raids.push({ messageId: messageId, messageTitle: raidTitle, players: [] });
    }
    removeUserAdditionEmojis(reaction: MessageReaction, user: User) {
        var reactions = reaction.message.reactions;
        additionsEmojis.forEach(emoji => {
            reactions.filter(r => r.emoji.name === emoji).forEach(re => {
                if (re.users.map(u => u.id).filter(id => id === user.id).length === 1) {
                    if (re.emoji.name != '👍' && re.emoji.name != reaction.emoji.name) {
                        re.remove(user);
                    }
                }
            });
        });
    }
    findDisplayName(message: Message) {
        return message.guild.members.find(x => x.id === message.author.id).displayName;
    }
    createRaidResponseMessage(reaction: MessageReaction) {
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
        reaction.message.edit(raidWithPlayersString);
    }
}
