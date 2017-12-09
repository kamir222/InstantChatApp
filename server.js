var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);
var history = [];
var clientCount = 0

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
  });
});



server.listen(8080, function() {
  console.log('Chat server running');
});