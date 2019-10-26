import { Message, MessageReaction, User, RichEmbed, RichEmbedOptions } from 'discord.js'
import { IPlayer } from "../interfaces/player.interface"
import { IRaid } from "../interfaces/raid.interface"
import { Player } from '../models/player.class'
import { Raid } from '../models/raid.class'
import { injectable } from 'inversify'
import "reflect-metadata"

const additionsEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']
const raidingInfo = `Reageer met 👍 om je aan de lijst toe te voegen\nReageer met:\n${additionsEmojis.join(' ')}\nom aan te geven dat je extra accounts of spelers mee hebt.`

@injectable()
export class RaidService {

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

    createRaid(message: Message, commandArguments: string[], startedBy: User): PokeBotErrors {
        var retVal = PokeBotErrors.UNKNOWN // expected error if user enters wrong date
        try {
            var timeArgument = commandArguments[commandArguments.length - 2].toLowerCase()
            var date = new Date()
            date.setHours(Number(timeArgument.split(":")[0]))
            date.setMinutes(Number(timeArgument.split(":")[1]))

            var now = new Date()
            if (date > now) {
                var endSecs = date.getTime()
                var nowSecs = now.getTime();
                var timeSpan = endSecs - nowSecs
                var raid = new Raid(message.id, commandArguments.join(" "), [], date, new Player(startedBy.id, startedBy.username))
                setTimeout(this.createRaidResponseMessage, timeSpan, message, raid)
                this.raids.push(raid); // create the raid

                retVal = PokeBotErrors.UNDEFINED
            } else {
                retVal = PokeBotErrors.WRONG_DATE
            }

        } catch (error) {
            console.log(error)
            retVal = PokeBotErrors.UNKNOWN
        }
        return retVal
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
    async createRaidResponseMessage(message: Message, raid: IRaid) {

        if (raid != null) {
            var description = ""
            raid.players.forEach((player: IPlayer) => {
                description += `\n${player.name}`;
                description += player.additions > 0 ? ` +${player.additions}` : '';
            });

            description += `\n\n${raid.closed ? "🔒 Raid is gesloten 🔒" : raidingInfo}`

            let richEmbed = new RichEmbed()
                .setTitle(raid.messageTitle + message.author.username)
                .setDescription(description)
                .setThumbnail("https://pokemongohub.net/wp-content/uploads/2019/10/darkrai-halloween.jpg")
                .setColor(raid.closed ? "#ff0000" : "#31d32b")

            await message.edit(richEmbed);
        }

        // var raidWithPlayersString = '';
        // this.raids.forEach((raid: IRaid) => {
        //     if (raid.messageId === reaction.message.id) {
        //         raidWithPlayersString += `${raid.messageTitle}`;
        //         raid.players.forEach((player: IPlayer) => {
        //             raidWithPlayersString += `\n${player.name}`;
        //             raidWithPlayersString += player.additions > 0 ? ` +${player.additions}` : '';
        //         });
        //     }
        // });
    }
}


export enum PokeBotErrors {
    UNDEFINED,
    WRONG_DATE,
    UNKNOWN
}

