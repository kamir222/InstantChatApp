const express = require('express')
const app = express()
const redis = require('redis')
const client = redis.createClient()

client.on('connect', () => {
  console.log('redis connected at hn: 127.0.0.1 port: 6379')
})

const http = require('http')
const server = http.Server(app)

app.use(express.static('client'))

const io = require('socket.io')(server)
let history = []
const clientCount = 0

const dayForecastExtractor = (forecast, weekDay) => {
  let weekDayForecast = {}
  forecast.map((elem, index) => {
    if (elem['day'] === weekDay) {
      weekDayForecast = elem
    }
  })
  return weekDayForecast
}

const conversationSet = {
  introduction: function(city, region, timeStamp) {
    return `<div id="message-block"><span><p>Hello I'm Eric,
     I'm your friendly weather bot. I know the weather in 
     ${city}, ${region} for the next 7 days.</p></span>
     ${timeStamp}</div>`
  },
  today: function(tempCurrent, conditionsCurrent, timeStamp) {
    return `<div id="message-block"><span><p>Todays forecast is 
    ${tempCurrent} and it is ${conditionsCurrent}.</p></span>
    ${timeStamp}</div>`
  },
  dayOfAWeek: function(day, tempHigh, tempLow, conditions) {
    return `${day} will be a high of ${tempHigh} and a low of ${tempLow} and it is ${conditions}`
  },
}

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

const fahrenheitToCelsiusConverter = number => {
  return Math.round((number - 32) * 0.5556)
}

let weatherApi = {}
getWeather(weather => {
  weatherApi = weather
})

const isEmpty = obj => {
  return Object.keys(obj).length === 0
}

const msgTimeStamp = `<span><p>${new Date().toLocaleTimeString()}</p></span>`

const clearAndStoreHistoryInterval = () => {
  nIntervalId = setInterval(clearAndStoreHistory, 20000)
}

const clearAndStoreHistory = () => {
  client.append('history', history.join(''), (err, reply) => {
    console.log(reply)
  })
  history = []
}

clearAndStoreHistoryInterval()
io.on('connection', function(socket) {
  io.emit('chatHistoy', history)
  let results = {}
  let forecast = {}
  let location = {}
  let currentConditions = {}

  if (!isEmpty(weatherApi)) {
    results = weatherApi['query']['results']['channel']
    forecast = results['item']['forecast']
    location = results['location']
    currentConditions = results['item']['condition']
  }

  socket.on('messageDetails', msg => {
    const message = msg.text.toLowerCase()
    const user = msg.name
    const formattedMessage = message.toLowerCase()
    const result = `<div id="message-block"><span><p>${user}${message}</p></span>${msgTimeStamp}</div>`
    const listItem = `<li>${result}</li>`

    history.push(listItem)
    io.emit('messageDetails', listItem)

    switch (true) {
      case formattedMessage.match(/\btoday\b/) !== null:
        var botWeatherMsg = conversationSet.today(
          fahrenheitToCelsiusConverter(currentConditions.temp),
          currentConditions.text,
          msgTimeStamp
        )
        break
      case formattedMessage.match(/\bmonday\b/) !== null:
        let mondayForecast = dayForecastExtractor(forecast, 'Mon')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'monday',
          fahrenheitToCelsiusConverter(mondayForecast.high),
          fahrenheitToCelsiusConverter(mondayForecast.low),
          mondayForecast.text
        )
        break
      case formattedMessage.match(/\btuesday\b/) !== null:
        let tuesdayForecast = dayForecastExtractor(forecast, 'Tue')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'tuesday',
          fahrenheitToCelsiusConverter(tuesdayForecast.high),
          fahrenheitToCelsiusConverter(tuesdayForecast.low),
          tuesdayForecast.text
        )
        break
      case formattedMessage.match(/\bwednesday\b/) !== null:
        let wednesdayForecast = dayForecastExtractor(forecast, 'Wed')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'wednesday',
          fahrenheitToCelsiusConverter(wednesdayForecast.high),
          fahrenheitToCelsiusConverter(wednesdayForecast.low),
          wednesdayForecast.text
        )
        break
      case formattedMessage.match(/\bthursday\b/) !== null:
        let thursdayForecast = dayForecastExtractor(forecast, 'Thu')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'thursday',
          fahrenheitToCelsiusConverter(thursdayForecast.high),
          fahrenheitToCelsiusConverter(thursdayForecast.low),
          thursdayForecast.text
        )
        break
      case formattedMessage.match(/\bfriday\b/) !== null:
        let fridayForecast = dayForecastExtractor(forecast, 'Fri')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'friday',
          fahrenheitToCelsiusConverter(fridayForecast.high),
          fahrenheitToCelsiusConverter(fridayForecast.low),
          fridayForecast.text
        )
        break
      case formattedMessage.match(/\bsaturday\b/) !== null:
        let saturdayForecast = dayForecastExtractor(forecast, 'Sat')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'saturday',
          fahrenheitToCelsiusConverter(saturdayForecast.high),
          fahrenheitToCelsiusConverter(requestedForecast.low),
          saturdayForecast.text
        )
        break
      case formattedMessage.match(/\bsunday\b/) !== null:
        let sundayForecast = dayForecastExtractor(forecast, 'Sun')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'sunday',
          fahrenheitToCelsiusConverter(sundayForecast.high),
          fahrenheitToCelsiusConverter(sundayForecast.low),
          sundayForecast.text
        )
        break
      default:
        var botWeatherMsg = conversationSet.introduction(
          location.city,
          location.region,
          msgTimeStamp
        )
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
