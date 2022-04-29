const { MessageEmbed, Channel } = require('discord.js')

const TwitchNotifier = require('./TwitchNotifier')

module.exports = {
  name: 'reactionrole',
  description: 'creates reaction role command',
  async execute(client, message){
    const rolesChannel = client.channels.cache.find(channel => channel.id === '958186182687211573')
    const streamerRole = message.guild.roles.cache.find(role => role.id === '958185711658479717')
    const wowRole = message.guild.roles.cache.find(role => role.id === '958185778150785045')
    const minecraftRole = message.guild.roles.cache.find(role => role.id === '958185823038218291')

    const streamerEmoji = '👾'
    const wowEmoji = '🐉' 
    const minecraftEmoji = '⛏'

    let reactionRoleEmbed = new MessageEmbed()
      .setColor('#7F00BE')
      .setTitle('Choose your roles!')
      .setDescription(`React to this message to obtain roles\n\n
      ${streamerEmoji} - to automatically send twitch live notifications to the #self-promos channel\n
      ${wowEmoji} - World of Warcraft\n
      ${minecraftEmoji} - Minecraft`)

    let embedMessage = await rolesChannel.send({embeds: [reactionRoleEmbed]})

    // initial embed reaction from bot
    embedMessage.react(streamerEmoji)
    embedMessage.react(wowEmoji)
    embedMessage.react(minecraftEmoji)

    client.on('messageReactionAdd', async (reaction, user) => {
      if (user.bot) return

      if (reaction.message.channel.id === '958186182687211573') {
        if (reaction.emoji.name === streamerEmoji) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(streamerRole)
        }
        if (reaction.emoji.name === wowEmoji) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(wowRole)
        }
        if (reaction.emoji.name === minecraftEmoji) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(minecraftRole)
        }
      }
    })

    client.on('messageReactionRemove', async (reaction, user) => {
      if (user.bot) return

      if (reaction.message.channel.id === '958186182687211573') {
        if (reaction.emoji.name === streamerEmoji) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(streamerRole)
        }
        if (reaction.emoji.name === wowEmoji) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(wowRole)
        }
        if (reaction.emoji.name === minecraftEmoji) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(minecraftRole)
        }
      }
    })

  }
}