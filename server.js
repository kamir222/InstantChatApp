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

let weatherApi = {}
getWeather(weather => {
  weatherApi = weather
})

const isEmpty =(obj) => {
  return Object.keys(obj).length === 0;
}

const msgTimeStamp = `<span><p>${new Date().toLocaleTimeString()}</p></span>`

io.on('connection', function(socket) {
  io.emit('chatHistoy', history)
  let results = {}
  let forecast = {}
  let location = {}
  let currentConditions = {}

  if (!isEmpty(weatherApi))  {
    results  = weatherApi['query']['results']['channel']
    forecast = results['item']['forecast']
    location = results['location']
    currentConditions = results['item']['condition']
  }
  
  console.log(results)

  const conversationSet = {
    introduction: `<div id="message-block"><span><p>
    Hello I'm Eric, I'm your friendly weather bot. I know the weather in 
    ${location.city}, ${location.region} for the next 7 days.
    </p></span>${msgTimeStamp}</div>`,
    today: `<div id="message-block"><span><p>
    Todays forecast is ${currentConditions.temp} and it is ${currentConditions.text}.
    </p></span>${msgTimeStamp}</div>`
  }

  socket.on('messageDetails', msg => {
    const message = msg.text
    const user = msg.name
    const formattedMessage = message.toLowerCase()   
    const result = `<div id="message-block"><span><p>${user}${message}</p></span>${msgTimeStamp}</div>`
    const listItem = `<li>${result}</li>`

    history.push(listItem)
    io.emit('messageDetails', listItem)
    
    let requestedForecast = {}   
    switch (true) {
      case formattedMessage.match(/\btoday\b/) !== null:
        var botWeatherMsg = conversationSet.today
      break
      case formattedMessage.match(/\bmonday\b/) !== null:
        forecast.map((elem, index) => {
          if (elem['day'] === 'Mon') {
            requestedForecast =  elem
          } 
        })
        var botWeatherMsg = `monday will be a high of ${requestedForcast.high} and a low of ${requestedForcast.low}. It will be ${requestedForcast.text}`
        break
      default:
        var botWeatherMsg = conversationSet.introduction
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
