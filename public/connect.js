// makes client socket connection to server
const socket = io.connect('localhost:3001');
let assignedTone;
//server emits "assignTone on connection"
socket.on("assignTone", data => {
  sessionStorage.setItem("tone", data)
  assignedTone = sessionStorage.getItem("tone")
  console.log('assigned tone ' + assignedTone)
})

socket.on('ping', function(data){
  socket.emit('pong', {beat: 1});
});

document.querySelector('body').addEventListener('click', e => {
  socket.emit('pressed', {
    time: Date.now(),
    tone: assignedTone,
  });

  // lights up / sounds assigned tone on board
  let light = document.querySelector(`#${assignedTone}`)
  
  light
    .classList
    .add('pressed');
  
  setTimeout(() => {
    light.classList.remove('pressed');
  }, 1500);
})
