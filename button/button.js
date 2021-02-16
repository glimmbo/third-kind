// Tone included in html

const body = document.getElementsByTagName("body")

// server emits "assignTone"
let assignedTone
socket.on("assignTone", data => {
  assignedTone = data
  sessionStorage.setItem("tone", assignedTone)
  console.log("assigned tone " + assignedTone)
})

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

// when screen pressed:
function sendTone() {
  body.removeEventListener("click", sendTone) // stop accepting clicks
  socket.emit("pressed", {
    // emits assignedTone
    tone: assignedTone,
  })
  console.log(Tone.now())
  lightUpAndPlay(assignedTone) // takes 1s (timeout)
  grid.addEventListener("click", sendTone) // accept clicks again
}
