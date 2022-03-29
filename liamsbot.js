// imports
require('dotenv').config()

const TwitchNotifier = require('./TwitchNotifier')
const { Client, Intents, MessageEmbed, Channel } = require('discord.js')

// environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

// initialize discord client
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

// run once bot comes online
client.on('ready', function(){
  console.log(`Logged in as ${client.user.tag}!`)
  const x = new TwitchNotifier(client, 'liamA6')
  const y = new TwitchNotifier(client, 'liamsbot69')

})

// auth
client.login(DISCORD_TOKEN)

// Commands
// rude comment
client.on('messageCreate', function(msg){
  if(msg.content.toLowerCase().includes('liamsbot')){
    msg.reply("keep my name out of your mouth")
  }
})