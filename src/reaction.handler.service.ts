// import { MessageReaction, User } from "discord.js"
// import { PokeBotRaidManager } from "./manager/PokeBotRaidManager"
// import { injectable } from "inversify"
// import { isNullOrUndefined } from "util"
// import { dependencyInjectionContainer } from "./di-container"

// const additionsEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']

// @injectable()
// export class ReactionHandlerService {
//     private pokeBotRaidManager: PokeBotRaidManager
//     constructor() {
//         this.pokeBotRaidManager = dependencyInjectionContainer.get(PokeBotRaidManager)
//     }

//     private reaction: MessageReaction | null = null
//     private user: User | null = null

//     setReactionUser(reaction: MessageReaction, user: User) {
//         this.reaction = reaction
//         this.user = user
//     }

//     handlePlayerLeavingRaid() {
//         if (!isNullOrUndefined(this.reaction) && !isNullOrUndefined(this.user)) {
//             this.pokeBotRaidManager.deletePlayerFromRaid(this.reaction.message.id, this.user.id);
//             this.pokeBotRaidManager.createRaidResponseMessage(this.reaction.message);
//         }
//     }

//     async handlePlayerJoiningRaid() {
//         if (!isNullOrUndefined(this.reaction) && !isNullOrUndefined(this.user)) {
//             this.pokeBotRaidManager.addPlayerToRaid(this.reaction, this.user);
//             await this.pokeBotRaidManager.createRaidResponseMessage(this.reaction.message);
//         }
//     }

//     handlePlayerRemovingAddition() {
//         if (!isNullOrUndefined(this.reaction) && !isNullOrUndefined(this.user)) {
//             var reactions = this.reaction.message.reactions;
//             var emojiUsers = reactions.filter(r => r.emoji.name === this.reaction!.emoji.name)
//             if (emojiUsers.values.length > 0) {
//                 emojiUsers.forEach(re => {
//                     if (re.users.map(u => u.id).filter(id => id === this.user!.id).length === 0) {
//                         this.pokeBotRaidManager.resetPlayerAdditions(this.reaction!.message.id, this.user!.id)
//                     }
//                 })
//             } else {
//                 var number = additionsEmojis.indexOf(this.reaction.emoji.name) + 1
//                 var additions = this.pokeBotRaidManager.getPlayerFromRaid(this.pokeBotRaidManager.getRaid(this.reaction.message.id), this.user.id).additions
//                 if (additions == number) {
//                     this.pokeBotRaidManager.resetPlayerAdditions(this.reaction.message.id, this.user.id);
//                 }
//                 this.pokeBotRaidManager.createRaidResponseMessage(this.reaction.message);
//             }
//         }
//     }
//     async handlePlayerAddingAddtion() {
//         if (!isNullOrUndefined(this.reaction) && !isNullOrUndefined(this.user)) {
//             await this.pokeBotRaidManager.removeUserAdditionEmojis(this.reaction, this.user);
//             this.pokeBotRaidManager.addPlayerAddition(this.reaction.message.id, this.user.id, this.reaction.emoji.name)
//         }
//     }
// }