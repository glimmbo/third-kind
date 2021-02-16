// makes client socket connection to ec2 server
// const socket = io.connect("10.0.0.5:3000")

let grid = document.querySelector("#grid")
let hint = document.querySelector("#hint")

// hacky event to keep connection active
// socket.on("lub", function (data) {
//   socket.emit("dub", "stayin alive")
// })

let tones = [
  { tone: "G4", socket: null },
  { tone: "A4", socket: null },
  { tone: "F4", socket: null },
  { tone: "F3", socket: null },
  { tone: "C4", socket: null },
]

//Tone Setup
let synth = new Tone.Synth().chain(Tone.Master)
Tone.Transport.bpm.value = 55

function lightUpAndPlay(tone) {
  let light = document.getElementById(tone)
  light.classList.add("pressed")
  synth.triggerAttackRelease(tone, "8n")
  setTimeout(() => {
    Tone.Transport.stop()
    light.classList.remove("pressed")
    console.log(Tone.now())
  }, 1000)
}

function backgroundFlash(correct) {
  if (correct) {
    grid.classList.add("correct")
    setTimeout(() => grid.classList.remove("correct"), 500)
  } else {
    grid.classList.add("incorrect")
    setTimeout(() => grid.classList.remove("incorrect"), 500)
  }
}

grid.addEventListener("click", sendTone)

function playSequence(toneArray) {
  // debugger
  //Tone.js events:
  let fivetones = new Tone.Sequence(
    // callback for each event (note)
    (time, note) => {
      synth.triggerAttackRelease(note, "8n", time)
    },
    // array of events (notes)
    [
      null,
      [toneArray[0], toneArray[1], toneArray[2], toneArray[3]],
      toneArray[4],
    ],
  )
  fivetones.loop = 0
  Tone.Transport.start("+0.1")
  fivetones.start()
}

socket.on("incorrect", async activeSequence => {
  console.log(activeSequence, " is incorrect")
  // remove listener to block any input during playback
  grid.removeEventListener("click", sendTone)
  // playback pattern, redflash
  // debugger
  await playSequence(activeSequence)
  await backgroundFlash(false)
  grid.addEventListener("click", sendTone)
})

socket.on("correct", async activeSequence => {
  console.log(activeSequence, " is correct")
  // playback pattern, green flash, over x secomds
  await playSequence(activeSequence)
  await backgroundFlash(true)
  // clear the array for next attempts
  socket.emit("reset")
  // load (redirect) to A-Frame when playback is done
  // window.location.href = "/arjs.html"
})
