const express = require('express')
const app = express()

const http = require('http')
const server = http.Server(app)

app.use(express.static('client'))

const io = require('socket.io')(server)
const history = []
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
    return `<div id="message-block"><span><p>
  Hello I'm Eric, I'm your friendly weather bot. I know the weather in 
  ${city}, ${region} for the next 7 days.
  </p></span>${timeStamp}</div>`
  },
  today: function(tempCurrent, conditionsCurrent, timeStamp) {
    return `<div id="message-block"><span><p>Todays forecast is ${tempCurrent} and it is ${conditionsCurrent}.</p></span>${timeStamp}</div>`
  },
  dayOfAWeek: function(day, tempHigh, tempLow) {
    return `${day} will be a high of ${tempHigh} and a low of ${tempLow}`
  },
}

// const getWeather = callback => {
//   const request = require('request')
//   request.get(
//     `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22toronto%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
//     (error, response) => {
//       if (!error && response.statusCode == 200) {
//         const data = JSON.parse(response.body)
//         callback(data)
//       }
//     }
//   )
// }

const fahrenheitToCelsiusConverter = number => {
  return Math.round((number - 32) * 0.5556)
}

// let weatherApi = {}
// getWeather(weather => {
//   weatherApi = weather
// })
const weatherApi = {
  query: {
    count: 1,
    created: '2017-12-19T20:32:49Z',
    lang: 'en-GB',
    results: {
      channel: {
        units: {
          distance: 'mi',
          pressure: 'in',
          speed: 'mph',
          temperature: 'F',
        },
        title: 'Yahoo! Weather - Toronto, ON, CA',
        link:
          'http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-4118/',
        description: 'Yahoo! Weather for Toronto, ON, CA',
        language: 'en-us',
        lastBuildDate: 'Tue, 19 Dec 2017 03:32 PM EST',
        ttl: '60',
        location: {
          city: 'Toronto',
          country: 'Canada',
          region: ' ON',
        },
        wind: {
          chill: '36',
          direction: '255',
          speed: '32',
        },
        atmosphere: {
          humidity: '66',
          pressure: '993.0',
          rising: '0',
          visibility: '16.1',
        },
        astronomy: {
          sunrise: '7:47 am',
          sunset: '4:43 pm',
        },
        image: {
          title: 'Yahoo! Weather',
          width: '142',
          height: '18',
          link: 'http://weather.yahoo.com',
          url: 'http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif',
        },
        item: {
          title: 'Conditions for Toronto, ON, CA at 02:00 PM EST',
          lat: '43.64856',
          long: '-79.385368',
          link:
            'http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-4118/',
          pubDate: 'Tue, 19 Dec 2017 02:00 PM EST',
          condition: {
            code: '23',
            date: 'Tue, 19 Dec 2017 02:00 PM EST',
            temp: '44',
            text: 'Breezy',
          },
          forecast: [
            {
              code: '23',
              date: '19 Dec 2017',
              day: 'Tue',
              high: '44',
              low: '35',
              text: 'Breezy',
            },
            {
              code: '30',
              date: '20 Dec 2017',
              day: 'Wed',
              high: '34',
              low: '23',
              text: 'Partly Cloudy',
            },
            {
              code: '14',
              date: '21 Dec 2017',
              day: 'Thu',
              high: '26',
              low: '18',
              text: 'Snow Showers',
            },
            {
              code: '16',
              date: '22 Dec 2017',
              day: 'Fri',
              high: '29',
              low: '24',
              text: 'Snow',
            },
            {
              code: '5',
              date: '23 Dec 2017',
              day: 'Sat',
              high: '44',
              low: '30',
              text: 'Rain And Snow',
            },
            {
              code: '28',
              date: '24 Dec 2017',
              day: 'Sun',
              high: '35',
              low: '26',
              text: 'Mostly Cloudy',
            },
            {
              code: '16',
              date: '25 Dec 2017',
              day: 'Mon',
              high: '26',
              low: '18',
              text: 'Snow',
            },
            {
              code: '23',
              date: '26 Dec 2017',
              day: 'Tue',
              high: '20',
              low: '7',
              text: 'Breezy',
            },
            {
              code: '30',
              date: '27 Dec 2017',
              day: 'Wed',
              high: '16',
              low: '4',
              text: 'Partly Cloudy',
            },
            {
              code: '30',
              date: '28 Dec 2017',
              day: 'Thu',
              high: '17',
              low: '6',
              text: 'Partly Cloudy',
            },
          ],
          description:
            '<![CDATA[<img src="http://l.yimg.com/a/i/us/we/52/23.gif"/>\n<BR />\n<b>Current Conditions:</b>\n<BR />Breezy\n<BR />\n<BR />\n<b>Forecast:</b>\n<BR /> Tue - Breezy. High: 44Low: 35\n<BR /> Wed - Partly Cloudy. High: 34Low: 23\n<BR /> Thu - Snow Showers. High: 26Low: 18\n<BR /> Fri - Snow. High: 29Low: 24\n<BR /> Sat - Rain And Snow. High: 44Low: 30\n<BR />\n<BR />\n<a href="http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-4118/">Full Forecast at Yahoo! Weather</a>\n<BR />\n<BR />\n<BR />\n]]>',
          guid: {
            isPermaLink: 'false',
          },
        },
      },
    },
  },
}
const isEmpty = obj => {
  return Object.keys(obj).length === 0
}

const msgTimeStamp = `<span><p>${new Date().toLocaleTimeString()}</p></span>`

io.on('connection', function(socket) {
  io.emit('chatHistoy', history)
  let results = {}
  let forecast = {}
  let location = {}
  let currentConditions = {}

  //if (!isEmpty(weatherApi)) {
  results = weatherApi['query']['results']['channel']
  forecast = results['item']['forecast']
  location = results['location']
  currentConditions = results['item']['condition']
  //}

  console.log(results)

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
          currentConditions.temp,
          currentConditions.text,
          msgTimeStamp
        )
        break
      case formattedMessage.match(/\bmonday\b/) !== null:
        let mondayForecast = dayForecastExtractor(forecast, 'Mon')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'monday',
          fahrenheitToCelsiusConverter(mondayForecast.high),
          fahrenheitToCelsiusConverter(mondayForecast.low)
        )
        break
      case formattedMessage.match(/\btuesday\b/) !== null:
        let tuesdayForecast = dayForecastExtractor(forecast, 'Tue')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'tuesday',
          tuesdayForecast.high,
          tuesdayForecast.low
        )
        break
      case formattedMessage.match(/\bwednesday\b/) !== null:
        let wednesdayForecast = dayForecastExtractor(forecast, 'Wed')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'wednesday',
          wednesdayForecast.high,
          wednesdayForecast.low
        )
        break
      case formattedMessage.match(/\bthursday\b/) !== null:
        let thursdayForecast = dayForecastExtractor(forecast, 'Thu')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'thursday',
          thursdayForecast.high,
          thursdayForecast.low
        )
        break
      case formattedMessage.match(/\bfriday\b/) !== null:
        let fridayForecast = dayForecastExtractor(forecast, 'Fri')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'friday',
          fridayForecast.high,
          fridayForecast.low
        )
        break
      case formattedMessage.match(/\bsaturday\b/) !== null:
        let saturdayForecast = dayForecastExtractor(forecast, 'Sat')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'saturday',
          saturdayForecast.high,
          requestedForecast.low
        )
        break
      case formattedMessage.match(/\bsunday\b/) !== null:
        let sundayForecast = dayForecastExtractor(forecast, 'Sun')
        var botWeatherMsg = conversationSet.dayOfAWeek(
          'sunday',
          sundayForecast.high,
          sundayForecast.low
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
