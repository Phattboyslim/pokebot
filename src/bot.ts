import { Message, Client, MessageReaction, User, GuildMember, Guild, Role } from 'discord.js'
import { ValidationHelper } from './helpers/ValidationHelper'
import { PokeBotRaidManager } from './manager/PokeBotRaidManager';
import { dependencyInjectionContainer } from "./di-container"
import { userInfo } from 'os';
import { isNullOrUndefined } from 'util';
const Discord = require('discord.js')

const pokeBotRaidManager = dependencyInjectionContainer.get<PokeBotRaidManager>(PokeBotRaidManager)

const botId = '623828070062620673'

// var Discord = require("discord.io");
var logger = require('winston')
var auth = require('../src/auth')
// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console(), {
  colorize: true,
})
logger.level = 'debug'
// Initialize Discord Bot
var bot: Client = new Discord.Client({
  token: auth.token,
  autorun: true,
})

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`)
})
function guildSetup(message: Message) {
  var guild: Guild = message.guild
  if (!isNullOrUndefined(guild)) {
    var roles: Role[] = guild.roles.map(x => x);
    if (!isNullOrUndefined(roles)) {
      if (roles.filter(x => x.name === PokemonFactions.Instinct).length === 0) {
        message.guild.createRole({
          name: 'Instinct',
          color: [240, 198, 20],
        })
      }
      if (roles.filter(x => x.name === PokemonFactions.Mystic).length === 0) {
        message.guild.createRole({
          name: 'Mystic',
          color: [57, 150, 219],
        })
      }
      if (roles.filter(x => x.name === PokemonFactions.Valor)) {
        message.guild.createRole({
          name: 'Valor',
          color: [219, 65, 62],
        })
      }
    }
  }
}
bot.on('message', async (message: Message) => {

  guildSetup(message);

  try {
    if (message.author.id != botId) {
      console.log(`Log: Received message from user: ${pokeBotRaidManager.findDisplayName(message)}`)
      const cmdSymbol = message.content.substring(0, 1)
      const cmdArguments = message.content
        .substring(['!', '?'].some(x => x === cmdSymbol) ? 1 : 0)
        .split(' ')
        .filter(Boolean) // `<- filters out empty strings

      if (ValidationHelper.isValidRaidRequestCommand(message.content)) {
        var response = ""
        if (["631914851710533642", "631624476173533184", "631726419243696128"].some(x => x === message.channel.id)) {
          response = "⚔️ " + cmdArguments.splice(2).join(' ') + " ⚔️";
          await message.channel.send(response);
        } else {
          response = "This command only works in raid channels\n"
          await message.author.send(response);
        }
        await message.delete();
      } else if (ValidationHelper.isValidHelpRequestCommand(message.content)) {
        var response = "Vroaget an mi aj ulpe nodig et 😂😂😂😂";
        await message.author.send(response);
        await message.delete();
      } else if (message.content === "Its over 9000! +10") {
        await message.channel.fetchMessages({ limit: Number(message.content.split(' ')[3].substring(1)) }).then(messages => {
          var filterMessages = messages.filter(x => x.content.indexOf("⚔️") == -1)
          filterMessages.forEach(async msg => {
            await msg.delete()
          })
        })
      } else if (ValidationHelper.isValidRankRequestCommand(message.content)) {
        var user = message.guild.members.filter(member => member.id === message.author.id).first()
        // console.log(user);
        var role = message.guild.roles.filter(x => x.name === message.content.split(' ')[1]).first()
        var updatedUser = await user.addRole(role)
        if (!isNullOrUndefined(updatedUser)) {
          message.reply(`je hebt ${role.name} gejoined!`)
        }

      }

    }
    else {
      console.log(`Log: Received message from bot: ${pokeBotRaidManager.findDisplayName(message)}`)
      if (message.content.indexOf("⚔️") > -1) {
        pokeBotRaidManager.createRaid(message.id, message.content);
      }
    }
  } catch (error) {
    console.log(error)
  }
})

export enum PokemonFactions {
  Instinct = "Instinct",
  Valor = "Valor",
  Mystic = "Mystic"
}
bot.on('messageReactionAdd', (reaction: MessageReaction, user: User) => {
  try {
    if (reaction.emoji.name === '👍') {
      pokeBotRaidManager.addPlayerToRaid(reaction, user);
      pokeBotRaidManager.createRaidResponseMessage(reaction)
    } else if (pokeBotRaidManager.isValidAdditionEmoji(reaction.emoji.name)) {
      pokeBotRaidManager.removeUserAdditionEmojis(reaction, user);
      pokeBotRaidManager.addPlayerAddition(reaction.message.id, user.id, reaction.emoji.name)
      pokeBotRaidManager.createRaidResponseMessage(reaction)
    }
  } catch (error) { console.log(error) }
})

bot.on('messageReactionRemove', (reaction: MessageReaction, user: User) => {
  try {
    if (reaction.emoji.name === '👍') {
      pokeBotRaidManager.deletePlayerFromRaid(reaction.message.id, user.id);
      pokeBotRaidManager.createRaidResponseMessage(reaction)
    } else if (pokeBotRaidManager.isValidAdditionEmoji(reaction.emoji.name)) {
      var reactions = reaction.message.reactions
      var emojiUsers = reactions.filter(r => r.emoji.name === reaction.emoji.name)
      if (emojiUsers.values.length > 0) {
        emojiUsers.forEach(re => {
          if (re.users.map(u => u.id).filter(id => id === user.id).length === 0) {
            pokeBotRaidManager.resetPlayerAdditions(reaction.message.id, user.id)
          }
        })
      } else {
        pokeBotRaidManager.resetPlayerAdditions(reaction.message.id, user.id)
        pokeBotRaidManager.createRaidResponseMessage(reaction)
      }
    }
  } catch (error) { console.log(error) }
})

bot.login(auth.token)
