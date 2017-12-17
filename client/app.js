var socket = io()

window.onload = function() {
  document.getElementById('chat-form').onsubmit = function(event) {
    event.preventDefault()
    var user = document.getElementById('initials').value
    var message = document.getElementById('message').value
    var messageDetails = {
      name: user,
      text: message,
    }
    socket.emit('messageDetails', messageDetails)
    document.getElementById('message').value = ''
    document.getElementById('initials').value = ''
  }

  socket.on('chatHistoy', function(history) {
    historyString = ''
    history.forEach(function(el) {
      historyString += el
    })
    if (
      historyString.replace(/\s+/g, '') !==
      document.getElementById('history').innerHTML.replace(/\s+/g, '')
    ) {
      document.getElementById('history').innerHTML += historyString
    }
  })
  socket.on('messageDetails', function(msg) {
    document.getElementById('history').innerHTML += msg
  })
}
