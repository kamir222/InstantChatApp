var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);
var history = [];
var clientCount = 0
var conversationSet = {
  'a': 'Paula', //what's your name? 
  'b': '26', //how old are you?
  'c': 'I am a food master', //what do you do? / what do you like?
  'd': 'I am a sexy woman', //default
}

var botResult = 
'<div id="message-block">' +
'<span><p>Hello. I am Paula. By the way, I\'m really sexy</p></span>' + 
'<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
'</div>' 
var listItemBot = '<li>' + botResult + '</li>'
history.push(listItemBot)

io.on('connection', function (socket) {
  io.emit('chatHistoy', history);
  setInterval(function(){ 
    io.emit('messageDetails', listItemBot); 
  }, 20000); //send a scarring message every 20 seconds
  socket.on('messageDetails', function (msg) {
  	var message = msg.text
    var user = msg.name
    var result =
    '<div id="message-block">' +
    // '<span><p>' + user + " said: " + message + '</p></span>' + 
    '<span><p>' + user + message + '</p></span>' + 
    '<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
    '</div>'
  	var listItem = '<li>' + result + '</li>'
    history.push(listItem)
    io.emit('messageDetails', listItem);

    var formattedMessage = message.toLowerCase()


    if (formattedMessage.match(/^.*?\bwhat\b.*?\bname\b.*?$/m) !== null) {
      var botResult = 
      '<div id="message-block">' +
      '<span><p>My name is Paula</p></span>' + 
      '<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
      '</div>' 
      var listItemBot = '<li>' + botResult + '</li>'
    } else if (formattedMessage.match(/^.*?\what\b.*?\like\b.*?$/m) !== null) {
      var botResult = 
      '<div id="message-block">' +
      '<span><p>I am a food wizard, not bragging or anything but im pretty great.</p></span>' + 
      '<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
      '</div>' 
      var listItemBot = '<li>' + botResult + '</li>'
    } else if (formattedMessage.match(/^.*?\how\b.*?\old\b.*?$/m) !== null || 
              formattedMessage.match(/^.*?\what\b.*?\age\b.*?$/m) !== null) {
      var botResult = 
      '<div id="message-block">' +
      '<span><p>I am timeless, baby</p></span>' + 
      '<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
      '</div>' 
      var listItemBot = '<li>' + botResult + '</li>'
    } else {
      var botResult = 
      '<div id="message-block">' +
      '<span><p>Hello. I am Paula. I can only answer these questions:<br/>what is your name?<br/>how old are you?<br/>what do you like?</p></span>' + 
      '<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
      '</div>' 
      var listItemBot = '<li>' + botResult + '</li>'     
    }
    history.push(listItemBot)
    setTimeout(function(){ io.emit('messageDetails', listItemBot); }, 1000);
  });
});



server.listen(8080, function() {
  console.log('Chat server running at 8080');
});