// imports
require('dotenv').config()
const Commands = require('./Commands')
const { Client, Intents, MessageEmbed, Channel, Collection } = require('discord.js')
const TwitchNotifier = require('./TwitchNotifier')

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const prefix = '/'

// initialize discord client
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
})


// run once bot comes online
client.on('ready', function(){
  console.log(`Logged in as ${client.user.tag}!`)
  new TwitchNotifier(client, 'liama6').start()
})

// auth
client.login(DISCORD_TOKEN)

// Commands
// rude comment
client.on('messageCreate', function(message) {

  // commands
  // if (message.content.startsWith(prefix)) {

  //   const args = message.content.slice(prefix.length).split(' ')
  //   const command = args.shift().toLowerCase()

  //   if (command === 'reactionroles'){
  //     if (message.member.permissions.has("ADMINISTRATOR")) {
  //       Commands.ReactionRoles.execute(client, message)
  //     } else {
  //       message.reply('you must be an admin to do that :/')
  //     }
  //   } else if (command === 'settwitchname') {
  //     Commands.SetTwitchName(client, args)
  //   } else {
  //     message.reply('that is not a command')
  //   }
    
  // }
})