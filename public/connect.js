// makes client socket connection to server
const socket = io.connect('localhost:3000');

document.getElementById('boop').addEventListener('click', e => {
  e.preventDefault();
  socket.emit('button pressed', 'data from button press');
})
