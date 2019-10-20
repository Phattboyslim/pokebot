import { Message, Client, MessageReaction, User, TextChannel } from 'discord.js'
import { ValidationHelper } from './helpers/ValidationHelper'
import { PokeBotRaidManager, PokeBotErrors } from './manager/PokeBotRaidManager';
import { MessageService } from './services/message.service';
import { dependencyInjectionContainer } from "./di-container"
import { Raid } from './models/Raid';

const Discord = require('discord.js')

const botId = '623828070062620673'

const additionsEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']

class PokeBot {
  private messageService: MessageService
  private pokeBotRaidManager: PokeBotRaidManager
  constructor() {
    this.messageService = dependencyInjectionContainer.get(MessageService)
    this.pokeBotRaidManager = dependencyInjectionContainer.get(PokeBotRaidManager)
  }
  auth = require('../src/auth')
  // Initialize Discord Bot
  bot: Client = new Discord.Client({
    token: this.auth.token,
    autorun: true
  })
  run() {
    this.bot.on('ready', async () => {
      console.log(`Logged in as ${this.bot.user.tag}!`)
    })

    this.bot.on('message', async (message: Message) => {
      this.messageService.setMessage(message)
      try {
        if (message.author.id != botId) {
          console.log(`Log: Received message from user: ${this.pokeBotRaidManager.findDisplayName(message)}`)
          if (ValidationHelper.isValidRaidCommand(message.content)) {
            if (ValidationHelper.isValidRaidRequestCommand(message.content)) {
              await this.messageService.handleRaidStart()
            } else {
              await message.delete()
              await message.author.send("Je hebt een verkeerd commando ingegeven!")
            }
          } else if (ValidationHelper.isValidHelpRequestCommand(message.content)) {
            this.messageService.handleHelpRequest()
          } else if (message.content === "Its over 9000! +10") {
            await this.messageService.handlePurgeRequest()
          } else if (ValidationHelper.isValidRankRequestCommand(message.content)) {
            var botUser = message.guild.members.filter(x => x.id === botId).first()
            if (botUser.hasPermission("MANAGE_NICKNAMES") && botUser.hasPermission("MANAGE_ROLES") && botUser.hasPermission("CHANGE_NICKNAME")) {
              this.messageService.handleRankRequest();
            }
          } else if (ValidationHelper.isValidLevelUpCommand(message.content)) {
            this.messageService.handleLevelUpRequest();
          } else if (ValidationHelper.isValidSetTopicCommand(message.content)) {
            this.messageService.handleSetChannelTopic();
          } else if (ValidationHelper.isValidPinMessageCommand(message.content)) {
            await this.messageService.handleSetPinnedMessage();
          }
        }
        else {
          console.log(`Log: Received message from bot`)
          var embeds = message.embeds
          if (embeds && embeds.length > 0 && embeds[0].title.indexOf("🗡️") > -1) {
            if (this.pokeBotRaidManager.createRaid(message, message.embeds[0].title) != PokeBotErrors.UNDEFINED) {
              await message.delete()
            }
          } else if (message.content.indexOf("📌") > -1) {
            await message.pin()
          }
        }
      } catch (error) {
        console.log(error)
      }
    })

    this.bot.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
      try {
        var raid: Raid = this.pokeBotRaidManager.getRaid(reaction.message.id);
        if (!raid.closed) {
          if (reaction.emoji.name === '👍') {
            this.pokeBotRaidManager.addPlayerToRaid(reaction, user);
            await this.pokeBotRaidManager.createRaidResponseMessage(reaction.message, this.pokeBotRaidManager.getRaid(reaction.message.id))
          } else if (this.pokeBotRaidManager.isValidAdditionEmoji(reaction.emoji.name) && !raid.closed) {
            await this.pokeBotRaidManager.removeUserAdditionEmojis(reaction, user);
            this.pokeBotRaidManager.addPlayerAddition(reaction.message.id, user.id, reaction.emoji.name)
            await this.pokeBotRaidManager.createRaidResponseMessage(reaction.message, this.pokeBotRaidManager.getRaid(reaction.message.id))
          } else {
            await this.pokeBotRaidManager.removeUserAdditionEmojis(reaction, user);
          }
        }
      } catch (error) { console.log(error) }
    })

    this.bot.on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
      console.log(this.pokeBotRaidManager.getRaid(reaction.message.id))
      try {
        var raid = this.pokeBotRaidManager.getRaid(reaction.message.id);
        if (!raid.closed) {
          if (reaction.emoji.name === '👍') {
            this.pokeBotRaidManager.deletePlayerFromRaid(reaction.message.id, user.id);
            this.pokeBotRaidManager.createRaidResponseMessage(reaction.message, this.pokeBotRaidManager.getRaid(reaction.message.id))
          } else if (this.pokeBotRaidManager.isValidAdditionEmoji(reaction.emoji.name)) {
            var reactions = reaction.message.reactions
            var emojiUsers = reactions.filter(r => r.emoji.name === reaction.emoji.name)
            if (emojiUsers.values.length > 0) {
              emojiUsers.forEach(re => {
                if (re.users.map(u => u.id).filter(id => id === user.id).length === 0) {
                  this.pokeBotRaidManager.resetPlayerAdditions(reaction.message.id, user.id)
                }
              })
            } else {
              var number = additionsEmojis.indexOf(reaction.emoji.name) + 1
              var additions = this.pokeBotRaidManager.getPlayerFromRaid(this.pokeBotRaidManager.getRaid(reaction.message.id), user.id).additions
              if (additions == number) {
                this.pokeBotRaidManager.resetPlayerAdditions(reaction.message.id, user.id)
              }
              this.pokeBotRaidManager.createRaidResponseMessage(reaction.message, this.pokeBotRaidManager.getRaid(reaction.message.id))
            }
          }
        }
      } catch (error) { console.log(error) }
    })

    this.bot.login(this.auth.token)
  }
}

new PokeBot().run()

