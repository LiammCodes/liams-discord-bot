require('dotenv').config()

const TwitchAPI = require('node-twitch').default
const { MessageEmbed, Channel } = require('discord.js')

module.exports = class TwitchNotifier {
  constructor(client, twitchName) {

    this.client = client
    this.twitchName = twitchName

    // different channel for my stream notifications
    if (this.twitchName === "liama6")  {
      this.CHANNEL_ID = process.env.DISCORD_NOTIFICATIONS_ID
    } else {
      this.CHANNEL_ID = process.env.DISCORD_SELF_PROMOS_ID
    }

    // initialize twitch api
    this.twitch = new TwitchAPI({
      client_id: process.env.TWITCH_CLIENT,
      client_secret: process.env.TWITCH_SECRET
    })

    // twitch live flag
    this.lastStatus = false
    this.currentStatus = false
    this.offlineCount = 5

  }

  // Function to send notification when live
  async send_embed(data) {
    const notifChannel = this.client.channels.cache.find(channel => channel.id === this.CHANNEL_ID)

    console.log(`Live Status: ${this.currentStatus} \n Response: ${data} \n Offline Count: ${this.offlineCount}`)
    console.log(` Start Time: ${data.started_at} \n ImageURL: ${data.getThumbnailUrl({width: 1600, height: 900})}`)

    // send live notification
    if (this.currentStatus === true && this.lastStatus === false && data != undefined){

      let live_time = new Date(data.started_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', timeZone: 'Canada/Eastern', timeZoneName: 'short'})
      let user = await this.twitch.getUsers(this.twitchName).then(async d => { return d.data[0] })
      let game_title = ""
      if (data.game_id != undefined){
        game_title = await this.twitch.getGames(data.game_id).then(async d => { return d.data[0].name })
      } else {
        game_title = "nothing"
      }

      const liveNotificationMsg = new MessageEmbed()
        .setColor('#FF3854')
        .setTitle(`${data.title}`)
        .setURL(`https://twitch.tv/${user.login}`)
        .setDescription(`${user.display_name} is now live on Twitch!`)
        .setThumbnail(`${user.profile_image_url}`)
        .addFields(
          { name: 'Start time:', value: `${live_time}`, inline: true },
          { name: 'Playing', value: `${game_title}`, inline: true },
        )
        .setImage(`${data.getThumbnailUrl({width: 1920, height: 1080})}`)
        .setTimestamp()

      notifChannel.send({
        content: '@everyone', 
        embeds: [liveNotificationMsg] 
      })
    }
  }

  async run() {
    await this.twitch.getStreams({
      channel: this.twitchName
    })
    .then(async data => {
      const response = data.data[0]
    
      // Manage response memory
      if (response !== undefined) {
        // channel is live
        if (response.type === "live") {
          if (this.currentStatus === false && this.lastStatus === false) {
            this.lastStatus = this.currentStatus
            this.currentStatus = true
          }
          this.offlineCount = 0
        // channel is offline
        } else {
          if (this.currentStatus === true && this.lastStatus === true && this.offlineCount > 4) {
            this.currentStatus = false
            this.lastStatus = false
            this.offlineCount = 0
          }
          this.offlineCount++
        }
  
        // send notification
        this.send_embed(response)
        this.lastStatus = this.currentStatus
        
      // channel is also offline
      } else {
        if (this.currentStatus === true && this.lastStatus === true && this.offlineCount > 4) {
          this.currentStatus = false
          this.lastStatus = false
          this.offlineCount = 0
        } else if (this.offlineCount < 5){
          this.offlineCount++
        }
      }
      console.log(`Name: ${this.twitchName} \n Live: ${this.currentStatus} \n Offline count: ${this.offlineCount}`)
    })
  }

  start() {
    this.interval = setInterval(() => {this.run()}, 15000)
  }

  stop() {
    clearInterval(this.interval)
  }
  
}