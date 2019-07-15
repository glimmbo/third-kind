// makes client socket connection to server
const socket = io.connect('localhost:3001');
let body = document.querySelector('body');
let grid = document.querySelector('#grid');
let hint = document.querySelector('#hint');
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

// hint audio
hint.addEventListener('click', (event) => {
  let fiveTones = new Audio('five-tones.wav');
  async function playTheFiveTones() {
    try {
      await fiveTones.play();
    } catch(err) {
      console.log(err)
    }
  }
  playTheFiveTones();
});

// eventually combine these two
function lightUp(tone) {
  let light = document.querySelector(`#${tone}`)
  light.classList.add('pressed');
  setTimeout(() => {
    light.classList.remove('pressed');
  }, 1000);
}

function playSound(tone) {
  // Tone.js?
}
// =======


// when body pressed:
function sendTone() {
  // stop accepting clicks
  grid.removeEventListener('click', sendTone);
  // emits assignedTone
  socket.emit('pressed', {
    time: Date.now(),
    tone: assignedTone,
  });
  // lights up on board (1s css)
  lightUp(assignedTone);
  // accept clicks again
  grid.addEventListener('click', sendTone);
}

function backgroundFlash(correct) {
  if (correct) {
    grid.classList.add('correct');
    setTimeout(() => grid.classList.remove('correct'), 500);
  } else {
    grid.classList.add('incorrect');
    setTimeout(() => grid.classList.remove('incorrect'), 500);
  }
}

grid.addEventListener('click', sendTone);

function playSequence(toneArray) {
  // remove listener to block any input during playback
  grid.removeEventListener('click', sendTone);
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
  setTimeout(() => grid.addEventListener('click', sendTone), 7000);
}

socket.on('incorrect', activeSequence => {
  console.log(activeSequence, " is incorrect");
  // playback pattern, redflash
  playSequence(activeSequence);
  setTimeout(() => {
    backgroundFlash(false);
    // alert('If you can only play one tone...')
  }, 7000);
});

socket.on('correct', activeSequence => {
  console.log(activeSequence, " is correct");
  // playback pattern, green flash, server sends A-frame page
  playSequence(activeSequence);
  setTimeout(() => {
    backgroundFlash(true);
    // alert('Well done, now look back to the table');
  }, 7000)
});
