//service worker registration:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then( (reg) => console.log("service worker registered", reg))
    .catch( (err) => console.log("service worker not registerd", err))
}

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

//Tone Setup
let synth = new Tone.Synth().chain(Tone.Master);
Tone.Transport.bpm.value = 55

function lightUpAndPlay(tone) {
  let light = document.getElementById(tone)
  light.classList.add('pressed');
  synth.triggerAttackRelease(tone, '8n');
  setTimeout(() => {
    Tone.Transport.stop();
    light.classList.remove('pressed');
    console.log(Tone.now());
  }, 1000);
}

// when grid pressed:
function sendTone() {
  grid.removeEventListener('click', sendTone);// stop accepting clicks
  socket.emit('pressed', { // emits assignedTone
    time: Date.now(),
    tone: assignedTone,
  });
  console.log(Tone.now())
  lightUpAndPlay(assignedTone); // takes 1s (timeout)
  grid.addEventListener('click', sendTone); // accept clicks again
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

function playSequence(toneArray, correct) {
  // remove listener to block any input during playback
  grid.removeEventListener('click', sendTone);

  // works, but duplicates a problem, closure?
  // toneArray.forEach((tone, i) => {
  //   setTimeout(() => {
  //     lightUpAndPlay(tone);
  //   }, (1000 * (i + 1)));
  // });

  //Better. Using Tone.js events:
  let fivetones = new Tone.Sequence(
    // callback for each event (note)
    (time, note) => {
      console.log(toneArray);
      console.log(time,note);
      synth.triggerAttackRelease(note, '8n', time);
      if (note === toneArray[4]) { // if last note
        Tone.Transport.stop(); // wait for it to finish (1 whole note)
        backgroundFlash(correct); // flash correct/incorrect
        if (!correct) { //if wrong
          // add listener to try again
          grid.addEventListener('click', sendTone);
        }
      }
    },
    // array of events (notes)
    [
      null,
      [
        toneArray[0],
        toneArray[1],
        toneArray[2],
        toneArray[3]
      ],
      toneArray[4]
    ]
  )
  fivetones.loop = 0;
  Tone.Transport.start("+0.1");
  fivetones.start();
}

socket.on('incorrect', activeSequence => {
  console.log(activeSequence, " is incorrect");
  // playback pattern, redflash
  playSequence(activeSequence, false);
});

socket.on('correct', activeSequence => {
  console.log(activeSequence, " is correct");
  // playback pattern, green flash, server sends A-frame page
  playSequence(activeSequence, true);
});
