// imports
require('dotenv').config()
const TwitchAPI = require('node-twitch').default

function TwitchNotifyer(twitchName, client) {
  this.twitchName = twitchName
  this.client = client
  const TwitchClientId = process.env.TWITCH_CLIENT
  const TwitchClientSecret = process.env.TWITCH_SECRET
  const ChannelId = process.env.DISCORD_CHANNEL_ID

  // initialize twitch api
  const twitch = new TwitchAPI({
    client_id: TwitchClientId,
    client_secret: TwitchClientSecret
  })

  // twitch live flag
  let lastStatus = false
  let currentStatus = false
  let offlineCount = 5

  // Function to send notification when live
  async function send_embed(data) {
    const notifChannel = client.channels.cache.find(channel => channel.id === ChannelId)

    console.log(`Live Status: ${currentStatus} \n Response: ${data} \n Offline Count: ${offlineCount}`)
    console.log(` Start Time: ${data.started_at} \n ImageURL: ${data.getThumbnailUrl({width: 1600, height: 900})}`)

    // send live notification
    if (currentStatus === true && lastStatus === false && data != undefined){

      let live_time = new Date(data.started_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', timeZone: 'Canada/Eastern', timeZoneName: 'short'})
      let user = await twitch.getUsers(TwitchName).then(async d => { return d.data[0] })
      let game_title = ""
      if (data.game_id != undefined){
        game_title = await twitch.getGames(data.game_id).then(async d => { return d.data[0].name })
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

      notifChannel.send({ embeds: [liveNotificationMsg] })
      lastStatus = currentStatus
    }
  }

  const run = async function Run() {
    await twitch.getStreams({
      channel: TwitchName
    })
    .then(async data => {
      const response = data.data[0]
    
      // Manage response memory
      if (response !== undefined) {
        // channel is live
        if (response.type === "live") {
          if (currentStatus === false && lastStatus === false) {
            lastStatus = currentStatus
            currentStatus = true
          }
          offlineCount = 0
        // channel is offline
        } else {
          if (currentStatus === true && lastStatus === true && offlineCount > 4) {
            currentStatus = false
            lastStatus = false
            offlineCount = 0
          }
          offlineCount++
        }
  
        // send notification
        send_embed(response)
        
      // channel is also offline
      } else {
        if (currentStatus === true && lastStatus === true && offlineCount > 4) {
          currentStatus = false
          lastStatus = false
          offlineCount = 0
        } else if (offlineCount < 5){
          offlineCount++
        }
      }
      console.log(`Status: ${currentStatus} \n Offline count: ${offlineCount}`)
    })
  }



  setInterval(run, 15000)
  

}

module.exports = TwitchNotifyer