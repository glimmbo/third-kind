// makes client socket connection to server
const socket = io.connect('localhost:3001');
let body = document.querySelector('body')
// hack event to keep connection active
socket.on('ping', function(data){
  socket.emit('pong', {beat: 1});
});
// server emits "assignTone" on connection
let assignedTone;

socket.on("assignTone", data => {
  sessionStorage.setItem("tone", data)
  assignedTone = sessionStorage.getItem("tone")
  console.log('assigned tone ' + assignedTone)
})

// combine these two
function lightUp(tone) {
  let light = document.querySelector(`#${tone}`)

  light.classList.add('pressed');
  
  setTimeout(() => {
    light.classList.remove('pressed');
  }, 1000);
}

function playSound(tone) {
  // Tone.js
}
// =======


// when body pressed:
function sendTone() {
  // emits assignedTone
  socket.emit('pressed', {
    time: Date.now(),
    tone: assignedTone,
  });
  // lights up on board
  lightUp(assignedTone);
}

function backgroundFlash(correct) {
  if (correct) {
    body.classList.add('correct');
    setTimeout(() => body.classList.remove('correct'), 500);
  } else {
    body.classList.add('incorrect');
    setTimeout(() => body.classList.remove('incorrect'), 500);
  }
}

body.addEventListener('click', sendTone);

function playSequence(toneArray) {
  // remove listener to block any input during playback
  body.removeEventListener('click', sendTone);
  // could be modified to hint at timing, tone.js?
  toneArray.forEach((tone, i) => {
    setTimeout(() => {
      lightUp(tone);
    }, 1000 * (i + 1));
  });
  // resume listener, after playback
  setTimeout(() => body.addEventListener('click', sendTone), 7000);
}

socket.on('incorrect', activeSequence => {
  console.log(activeSequence, " is incorrect");
  // playback pattern, redflash
  playSequence(activeSequence);
  setTimeout(() => backgroundFlash(false), 7000);
});

socket.on('correct', activeSequence => {
  console.log(activeSequence, " is correct");
  // playback pattern, green flash, load animation page (A-frame)
  playSequence(activeSequence);
  setTimeout(() => backgroundFlash(true), 7000);
});
