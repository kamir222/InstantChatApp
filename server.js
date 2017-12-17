const express = require('express')
const app = express()

const http = require('http')
const server = http.Server(app)

app.use(express.static('client'))

const io = require('socket.io')(server)
const history = []
const clientCount = 0

const getWeather = callback => {
  const request = require('request')
  request.get(
    `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22toronto%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    (error, response) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(response.body)
        callback(data)
      }
    }
  )
}

const weatherApi = []
const daysOfTheWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'saturday',
]

const humanizeApi = (city, temp, timestamp) => {
  return `<div id="message-block"><span><p>It is ${temp} in ${city}</p></span>${timestamp}</div>`
}

io.on('connection', function(socket) {
  io.emit('chatHistoy', history)
  getWeather(weather => {
    weatherApi.push(weather)
    const results = weatherApi[0]['query']['results']
    console.log(results)
  })

  socket.on('messageDetails', msg => {
    const message = msg.text
    const user = msg.name
    const formattedMessage = message.toLowerCase()
    const msgTimeStamp = `<span><p>${new Date().toLocaleTimeString()}</p></span>`
    const result = `<div id="message-block"><span><p>${user}${message}</p></span>${msgTimeStamp}</div>`
    const listItem = `<li>${result}</li>`

    history.push(listItem)
    io.emit('messageDetails', listItem)

    switch (true) {
      case formattedMessage.match(/\btoday\b/) !== null:
        var botWeatherMsg = humanizeApi('Toronto', '-7', msgTimeStamp)
        break
      default:
        var botWeatherMsg = `<div id="message-block"><span><p>
        Hello I'm Eric, I'll make suggestion to what you should wear based on the weather.
        </p></span>${msgTimeStamp}</div>`
    }

    const listItemBotWeather = `<li> ${botWeatherMsg} </li>`
    history.push(listItemBotWeather)
    setTimeout(() => {
      io.emit('messageDetails', listItemBotWeather)
    }, 1000)
  })
})

server.listen(8080, () => {
  console.log('Chat server running at 8080')
})
