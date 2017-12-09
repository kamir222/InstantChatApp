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

io.on('connection', function (socket) {
  io.emit('chatHistoy', history);
  socket.on('messageDetails', function (msg) {
  	var message = msg.text
    var user = msg.name
    var result =
    '<div id="message-block">' +
    '<span><p>' + user + " said: " + message + '</p></span>' + 
    '<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
    '</div>'
  	var listItem = '<li>' + result + '</li>'
    history.push(listItem)
    io.emit('messageDetails', listItem);
    if (message.match(/\?$/) !== null  && 
    message.match(/^.*?\bwhat\b.*?\bname\b.*?$/m) !== null) {
      var botResult = 
      '<div id="message-block">' +
      '<span><p> Paula said: My name is Paula</p></span>' + 
      '<span><p>' + new Date().toLocaleTimeString() + '</p></span>' +
      '</div>' 
      var listItemBot = '<li>' + botResult + '</li>'
      history.push(listItemBot)
      setTimeout(function(){ io.emit('messageDetails', listItemBot); }, 1000);
    }
  });
});



server.listen(8080, function() {
  console.log('Chat server running');
});