var socket = io()

window.onload = () => {
  document.getElementById('chat-form').onsubmit = function(event) {
    event.preventDefault()
    var message = document.getElementById('message').value
    socket.emit('messageDetails', message)
    document.getElementById('message').value = '' 
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
