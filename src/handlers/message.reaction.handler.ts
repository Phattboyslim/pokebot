import { MessageReaction, User } from "discord.js";
import { RaidService } from "../services/raid.service";
import { dependencyInjectionContainer } from "../di-container";
import { Raid } from "../models/raid.class";
import { MessageService } from "../services/message.service";

const additionsEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']
export class MessageReactionHandler {
  raidService: RaidService
  messageService: MessageService
  constructor() {
    this.raidService = dependencyInjectionContainer.get(RaidService)
    this.messageService = dependencyInjectionContainer.get(MessageService)
  }
  handleAdd(reaction: MessageReaction, user: User) {
    try {
      var raid: Raid = this.raidService.getRaid(reaction.message.id);
      if (!raid.closed) {
        if (reaction.emoji.name === '👍') {
          this.raidService.addPlayerToRaid(reaction, user);
          this.messageService.createRaidResponseMessage(reaction.message, this.raidService.getRaid(reaction.message.id))
        } else if (this.raidService.isValidAdditionEmoji(reaction.emoji.name) && !raid.closed) {
          this.raidService.removeUserAdditionEmojis(reaction, user);
          this.raidService.addPlayerAddition(reaction.message.id, user.id, reaction.emoji.name)
          this.messageService.createRaidResponseMessage(reaction.message, this.raidService.getRaid(reaction.message.id))
        } else {
          this.raidService.removeUserAdditionEmojis(reaction, user);
        }
      }
    } catch (error) { console.log("Error: ", error) }
  }
  handleRemove(reaction: MessageReaction, user: User) {
    console.log("Info: ", this.raidService.getRaid(reaction.message.id))
    try {
      var raid = this.raidService.getRaid(reaction.message.id);
      if (!raid.closed) {
        if (reaction.emoji.name === '👍') {
          this.raidService.deletePlayerFromRaid(reaction.message.id, user.id);
          this.messageService.createRaidResponseMessage(reaction.message, this.raidService.getRaid(reaction.message.id))
        } else if (this.raidService.isValidAdditionEmoji(reaction.emoji.name)) {
          var reactions = reaction.message.reactions
          var emojiUsers = reactions.filter((messageReaction: MessageReaction) => messageReaction.emoji.name === reaction.emoji.name)
          if (emojiUsers.values.length > 0) {
            emojiUsers.forEach(re => {
              if (re.users.map(u => u.id).filter(id => id === user.id).length === 0) {
                this.raidService.resetPlayerAdditions(reaction.message.id, user.id)
              }
            })
          } else {
            var number = additionsEmojis.indexOf(reaction.emoji.name) + 1
            var additions = this.raidService.getPlayerFromRaid(this.raidService.getRaid(reaction.message.id), user.id).additions
            if (additions == number) {
              this.raidService.resetPlayerAdditions(reaction.message.id, user.id)
            }
            this.messageService.createRaidResponseMessage(reaction.message, this.raidService.getRaid(reaction.message.id))
          }
        }
      }
    } catch (error) { console.log("Error: ", error) }
  }
}