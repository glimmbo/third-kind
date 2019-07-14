// makes client socket connection to server
const socket = io.connect('localhost:3001');
let body = document.querySelector('body')
// hacky event to keep connection active
socket.on('lub', function(data){
  socket.emit('dub', 'stayin alive');
});
// server emits "assignTone" on connection
let assignedTone;

socket.on("assignTone", data => {
  sessionStorage.setItem("tone", data)
  assignedTone = sessionStorage.getItem("tone")
  console.log('assigned tone ' + assignedTone)
})
//plays the hint
window.addEventListener('DOMContentLoaded', (event) => {
  let fiveTones = new Audio('five-tones.wav');
  async function playAudio() {
    try {
      await fiveTones.play();
    } catch(err) {
      console.log(err)
    }
  }
  playAudio();
});

// ===
// eventually combine these two
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
  // stop accepting clicks
  body.removeEventListener('click', sendTone);
  // emits assignedTone
  socket.emit('pressed', {
    time: Date.now(),
    tone: assignedTone,
  });
  // lights up on board (1s css)
  lightUp(assignedTone);
  // accept clicks again
  body.addEventListener('click', sendTone);
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
  // could be modified to hint at musical timing via tone.js?

  // works, but duplicates a problem
  toneArray.forEach((tone, i) => {
    setTimeout(() => {
      lightUp(tone);
    }, (1000 * (i + 1)));
  });
  
  //doesn't work
  // for (let i = 0; i < tonesArray.length; i++) {
  //  const tone = tonesArray[i];
  //   setTimeout(() => {
  //     lightUp(tone);
  //   }, (1000 * (i + 1)));
  // }
    // expect:
    // setTimeout(() => lightUp(tone), 1000)
    // setTimeout(() => lightUp(tone), 2000)
    // setTimeout(() => lightUp(tone), 3000)
    // setTimeout(() => lightUp(tone), 4000)
    // setTimeout(() => lightUp(tone), 5000)

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
