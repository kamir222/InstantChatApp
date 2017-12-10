var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);
var history = [];
var clientCount = 0
var botPaulaConversationSet = {
  'a': 'My name is Paula', //what's your name? 
  'b': 'I am timeless, baby', //how old are you?
  'c': 'I am a food wizard, not bragging or anything but im pretty great.', //what do you do? / what do you like?
  'd': 'Hello. I am Paula. I can only answer these questions:<br/>what is your name?<br/>how old are you?<br/>what do you like?', //default
}

var botPaulaMsg = 
'<div id="message-block">' +
'<span><p>Hello. I am Paula. By the way, I\'m really sexy</p></span>' + 
'<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
'</div>' 
var listItemBotPaula = '<li>' + botPaulaMsg + '</li>'
function sendIntervalBotPaulaMsg() { 
  history.push(listItemBotPaula)
  io.emit('messageDetails', listItemBotPaula); 
}
setInterval(sendIntervalBotPaulaMsg, 20000); //send a scarring message every 20 seconds

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
    // '<span><p>' + user + " said: " + message + '</p></span>' + 
  	var listItem = '<li>' + result + '</li>'
    history.push(listItem)
    io.emit('messageDetails', listItem);

    switch (true) {
      case (formattedMessage.match(/^.*?\bwhat\b.*?\bname\b.*?$/m) !== null):
        var botPaulaMsg = 
        '<div id="message-block">' + '<span><p>' + botPaulaConversationSet.a + 
        '</p></span>' + msgTimeStamp + '</div>' 
        break
      case (formattedMessage.match(/^.*?\what\b.*?\like\b.*?$/m) !== null):
        var botPaulaMsg = 
        '<div id="message-block">' + '<span><p>' + botPaulaConversationSet.c  + 
        '</p></span>' + msgTimeStamp + '</div>' 
        break
      case (formattedMessage.match(/^.*?\how\b.*?\old\b.*?$/m) !== null): 
        var botPaulaMsg = 
        '<div id="message-block">' + '<span><p>' + botPaulaConversationSet.b + 
        '</p></span>' + msgTimeStamp + '</div>' 
        break
      default: 
        var botPaulaMsg = 
        '<div id="message-block">' + '<span><p>' + botPaulaConversationSet.d + 
        '</p></span>' + msgTimeStamp + '</div>'
    }
    var listItemBotPaula = '<li>' + botPaulaMsg + '</li>'
    history.push(listItemBotPaula)
    setTimeout(function(){ io.emit('messageDetails', listItemBotPaula); }, 1000);
  });
});

server.listen(8080, function() {
  console.log('Chat server running at 8080');
});