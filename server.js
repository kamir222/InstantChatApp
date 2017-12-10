var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);
var history = [];
var clientCount = 0

var botWeatherConversationSet = { "consolidated_weather": 
[ { "id": 5093320921448448,
"weather_state_name": "Heavy Rain",
"weather_state_abbr": "hr",
"wind_direction_compass": "S",
"created": "2017-08-11T20:34:23.801200Z",
"applicable_date": "2017-08-11",
"min_temp": 19.16,
"max_temp": 23.448333333333334,
"the_temp": 22.886666666666667,
"wind_speed": 6.816575418346193,
"wind_direction": 179.21851889023347,
"air_pressure": 1012.51,
"humidity": 84,
"visibility": 11.815062534796787,
"predictability": 77 } ],
"time": "2017-08-11T19:10:55.555640-04:00",
"sun_rise": "2017-08-11T06:17:56.668717-04:00",
"sun_set": "2017-08-11T20:28:07.284434-04:00",
"timezone_name": "LMT",
"parent": 
{ "title": "Canada",
"location_type": "Country",
"woeid": 23424775,
"latt_long": "56.954681,-98.308968" },
"sources": 
[ { "title": "BBC",
"slug": "bbc",
"url": "http://www.bbc.co.uk/weather/",
"crawl_rate": 180 } ],
"title": "Toronto",
"location_type": "City",
"woeid": 4118,
"latt_long": "43.648560,-79.385368",
"timezone": "America/Toronto" }

io.on('connection', function (socket) {
  io.emit('chatHistoy', history);
  socket.on('messageDetails', function (msg) {
  	var message = msg.text
    var user = msg.name
    var formattedMessage = message.toLowerCase()
    var msgTimeStamp = '<span><p>' + new Date().toLocaleTimeString() + '</p></span>'
    var result =
    '<div id="message-block">' + '<span><p>' + user + message +
    '</p></span>' + msgTimeStamp + '</div>'
    var listItem = '<li>' + result + '</li>'
    
    history.push(listItem)
    io.emit('messageDetails', listItem);

    switch (true) {
      case (formattedMessage.match(/^.*?\what\b.*?\weather\b.*?$/m) !== null): 
        var botWeatherMsg = 
        '<div id="message-block">' + '<span><p> The tempreture in the city of ' + 
        botWeatherConversationSet["title"] + ' is ' + 
        Math.round(botWeatherConversationSet["consolidated_weather"][0]["the_temp"]) +
        ' degrees celcius with a state of ' + 
        botWeatherConversationSet["consolidated_weather"][0]["weather_state_name"] + 
        '</p></span>' + msgTimeStamp + '</div>' 
        break
      default: 
      var botWeatherMsg = 
      '<div id="message-block">' + '<span><p>Please ask me about the weather</p></span>' + msgTimeStamp + '</div>' 
    }

    var listItemBotWeather = '<li>' + botWeatherMsg + '</li>'
    history.push(listItemBotWeather)
    setTimeout(function(){ io.emit('messageDetails', listItemBotWeather); }, 1000);

  });
});

server.listen(8080, function() {
  console.log('Chat server running at 8080');
});