const express = require('express')
const app = express()

const http = require('http')
const server = http.Server(app)

app.use(express.static('client'))

const io = require('socket.io')(server)
const history = []
const clientCount = 0

// const getNews = callback => {
//   const request = require('request')
//   request.get(
//     `http://www.faroo.com/api?q=iphone&start=1&length=10&l=en&src=news&f=json&jsoncallback=mycallback`,
//     (error, response) => {
//       if (!error && response.statusCode == 200) {
//         const data = JSON.parse(response.body)
//         callback(data)
//       }
//     }
//   )
// }
const getNews = () => {
  const API = {
    results: [
      {
        title: 'The 7 best free iPhone games of the week',
        kwic:
          'As the holiday season is finally in full swing, many of you are probably traveling, preparing to travel or back at home with very little to do. ...',
        content: '',
        url:
          'http://bgr.com/2017/12/17/best-free-iphone-games-app-store-dec-14/',
        iurl:
          'https://boygeniusreport.files.wordpress.com/2017/12/box-boss.jpg?quality=98&amp;strip=all',
        domain: 'bgr.com',
        author: 'Jacob Siegal',
        news: true,
        votes: '20',
        date: 1513536213000,
        related: [],
      },
      {
        title: 'Any phone but iPhone X, according to this Sprint salesman',
        kwic:
          'Commentary: In my visit to the last of the big four carrier stores, the salesman was bullish, animated and adamant.',
        content: '',
        url:
          'https://www.cnet.com/news/any-phone-but-iphone-x-said-the-sprint-salesman/',
        iurl:
          'https://cnet1.cbsistatic.com/img/OQF_yQMu7F7_i5O9Q3zZLDN-sVs=/300x230/2017/11/06/59a4b42c-80dd-4a3a-9db6-e5d5bbced076/iphone-x-camera-water-moisture-lens-5330.jpg',
        domain: 'www.cnet.com',
        author: 'Chris Matyszczyk',
        news: true,
        votes: '20',
        date: 1513527355000,
        related: [],
      },
      {
        title:
          "I traveled for weeks with an iPhone X as my only computer â€” here's what I loved, and what Apple needs ...",
        kwic:
          "I took my new iPhone X with me on a weeks-long vacation to Italy, forgoing a laptop or tablet.  The phone's camera and the battery life made ...",
        content: '',
        url:
          'http://www.businessinsider.com/iphone-x-is-a-great-travel-companion-2017-12',
        iurl:
          'http://static4.businessinsider.com/image/59ef5283ddd06385168b48d6-1024/gettyimages-846148982.jpg',
        domain: 'www.businessinsider.com',
        author: 'Matt Weinberger',
        news: true,
        votes: '20',
        date: 1513521000000,
        related: [],
      },
      {
        title:
          'iOS 11.2.1 jailbreak on iPhone X revealed by Alibaba researchers',
        kwic:
          'Last week, Apple released the iOS 11.2.1 update, addressing a number of software bugs for iPhone and iPad owners. However, only a few days later, ...',
        content: '',
        url:
          'https://www.slashgear.com/ios-11-2-1-jailbreak-on-iphone-x-revealed-by-alibaba-researchers-17512038/',
        iurl:
          'https://c.slashgear.com/wp-content/uploads/2017/12/iphone-x-wireless-charging-1-1280x720-1-635x383.jpg',
        domain: 'www.slashgear.com',
        author: 'Adam Westlake',
        news: true,
        votes: '20',
        date: 1513519205000,
        related: [],
      },
      {
        title:
          "The Telegraph Interviews Apple's Phil Schiller on iPhone X, a Rash of Software Problems and Augmented ...",
        kwic:
          '... death and then a slow rise to fame after the return of Steve Jobs who pushed the company in new directions with the iPod, iTunes, the iPhone, ...',
        content: '',
        url:
          'http://www.patentlyapple.com/patently-apple/2017/12/the-telegraph-interviews-apples-phil-schiller-on-iphone-x-a-rash-of-software-problems-and-augmented-reality.html',
        iurl: '',
        domain: 'www.patentlyapple.com',
        author: 'Jack Purcher',
        news: true,
        votes: '10',
        date: 1513518118000,
        related: [],
      },
      {
        title: 'iPhone X VS Razer Phone VS OnePlus 5T Speed Test',
        kwic:
          '... because as the video above shows, the amount of RAM certainly has a huge impact on performance.  The video above by PhoneBuff sees the iPhone ...',
        content: '',
        url:
          'http://www.ubergizmo.com/2017/12/iphone-x-razer-phone-oneplus-5t-speed-test/',
        iurl: '',
        domain: 'www.ubergizmo.com',
        author: 'Tyler Lee',
        news: true,
        votes: '10',
        date: 1513489061000,
        related: [],
      },
      {
        title: 'Analyst Claims iPhone X Isnâ€™t Doing As Well As Apple Hoped',
        kwic:
          'The iPhone X is Appleâ€™s latest flagship and as we have seen with Apple flagships in the past, it was expected to do really well. However the ...',
        content: '',
        url:
          'http://www.ubergizmo.com/2017/12/iphone-x-not-doing-as-well-as-hoped/',
        iurl:
          'http://cdn2.ubergizmo.com/wp-content/uploads/2017/11/iphone-x-640x604.jpg',
        domain: 'www.ubergizmo.com',
        author: 'Tyler Lee',
        news: true,
        votes: '20',
        date: 1513488993000,
        related: [],
      },
      {
        title: 'iPhone X: Face ID Is Less Than Perfect',
        kwic:
          'Using the iPhone X since November 3 has been a pleasure, for the most part, even though the iPhone X isnâ€™t quite the â€œJesus Phoneâ€ that it was ...',
        content: '',
        url:
          'https://www.inquisitr.com/opinion/4687489/iphone-x-face-id-less-than-perfect/',
        iurl:
          'https://cdn.inquisitr.com/wp-content/uploads/2017/12/iphone-x-face-id.jpg',
        domain: 'www.inquisitr.com',
        author: 'Daryl Deino',
        news: true,
        votes: '20',
        date: 1513482041000,
        related: [],
      },
      {
        title: 'iPhone X: Face ID Has Its Faults',
        kwic:
          'Using the iPhone X since November 3 has been a pleasure, for the most part, even though the iPhone X isnâ€™t quite the â€œJesus Phoneâ€ that it was ...',
        content: '',
        url:
          'https://www.inquisitr.com/opinion/4687489/iphone-x-face-id-has-its-faults/',
        iurl:
          'https://cdn.inquisitr.com/wp-content/uploads/2017/12/iphone-x-face-id.jpg',
        domain: 'www.inquisitr.com',
        author: 'Daryl Deino',
        news: true,
        votes: '20',
        date: 1513482041000,
        related: [],
      },
      {
        title:
          'How to Scan a QR Code Using the Camera on the iPhone or the iPad',
        kwic:
          "... like URLs without having to download a third-party app. Here's how to scan a QR code when you run into one: Open the Camera app on the iPhone ...",
        content: '',
        url: 'https://www.macrumors.com/how-to/scan-qr-codes-with-camera/',
        iurl: 'https://www.youtube.com/embed/plpiW8xf3Mc',
        domain: 'www.macrumors.com',
        author: 'Juli Clover',
        news: true,
        votes: '20',
        date: 1513452910000,
        related: [],
      },
    ],
    query: 'iphone',
    suggestions: [],
    count: 60,
    start: 1,
    length: 10,
    time: '22',
  }
  return API
}

io.once('connection', socket => {
  io.emit('chatHistoy', history)
  let newsApi = []
  // getNews(news => {
  //   newsApi.push(news)
  //   console.log(newsApi)
  // })
  const newsAPI = getNews()
  console.log(newsAPI)

  socket.on('messageDetails', msg => {
    const message = msg
    const formattedMessage = message.toLowerCase()
    const msgTimeStamp = `<span><p>${new Date().toLocaleTimeString()}</p></span>`
    const result = `<div id="message-block"><span><p>${message}</p></span>${msgTimeStamp}</div>`
    const listItem = `<li>${result}</li>`

    history.push(listItem)
    io.emit('messageDetails', listItem)

    var botWeatherMsg = `<div id="message-block"><span><p>
    Hello I'm Eric, tell me what you want to know about in one word and I'll give you 10 of the latest news on that subject.
    </p></span>${msgTimeStamp}</div>`

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
