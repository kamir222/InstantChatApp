var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);
var history = [];
var clientCount = 0

function getWeather(callback) {
  var request = require('request');
  request.get(
    "https://www.metaweather.com/api/location/4118/",
    function (error, response) {
  if (!error && response.statusCode == 200) {
    var data = JSON.parse(response.body);
      callback(data);
    }
  })
 }

 var weatherApi = []
 

io.on('connection', function (socket) {
  io.emit('chatHistoy', history);
  getWeather(function(weather) {
    weatherApi.push(weather)
    console.log(weatherApi[0]['consolidated_weather'])
  })
  
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
      case (formattedMessage.match(/\btoday\b/) !== null): 
        var botWeatherMsg = 
        '<div id="message-block">' + '<span><p> The tempreture in the city of ' + 
        weatherApi[0]['title'] + ' is ' + 
        Math.round(weatherApi[0]["consolidated_weather"][0]["the_temp"]) +
        ' degrees celcius with a state of ' + 
        weatherApi[0]["consolidated_weather"][0]["weather_state_name"] + 
        '</p></span>' + msgTimeStamp + '</div>' 
        break
      case (formattedMessage.match(/\btomorrow\b/) !== null): 
        var botWeatherMsg = 
        '<div id="message-block">' + '<span><p> The tempreture in the city of ' + 
        weatherApi[0]['title'] + ' is ' + 
        Math.round(weatherApi[0]["consolidated_weather"][1]["the_temp"]) +
        ' degrees celcius with a state of ' + 
        weatherApi[0]["consolidated_weather"][1]["weather_state_name"] + 
        '</p></span>' + msgTimeStamp + '</div>' 
        break
      default: 
      var botWeatherMsg = 
      '<div id="message-block">' + 
      '<span><p></p></span>' +
      'Hello, I\'m your friendly weather bot. I know what the weather is in Toronto for the next 7 days.' +
       msgTimeStamp + '</div>' 
    }

    var listItemBotWeather = '<li>' + botWeatherMsg + '</li>'
    history.push(listItemBotWeather)
    setTimeout(function(){ io.emit('messageDetails', listItemBotWeather); }, 1000);

  });
});

server.listen(8080, function() {
  console.log('Chat server running at 8080');
});