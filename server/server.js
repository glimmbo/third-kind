const express = require("express")
const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

//helper functions
const randomFreeTone = require("./randomFreeTone")
const unassignTone = require("./src/unassignTone")
const correctSequence = require("./correctSequence")

//keeps connections active
// function sendHeartbeat() {
//   setTimeout(sendHeartbeat, 8000)
//   io.sockets.emit("lub", "stayin alive?")
// }
// setTimeout(sendHeartbeat, 8000)

//returns array of connected clients
const connectedClients = () => {
  return Object.keys(io.sockets.connected)
}

// goal: limit to 5 connected users
// doesn't work..but still triggers sometimes?
// function capacity(req, res, next) {
//   console.log('capacity middleware')
//   if (connectedClients().length <= 4) {
//     next();
//   } else {
//     res.sendFile(__dirname + '/public/busy.html');
//   }
// };
// app.use(capacity);
// ===

// array of correct sequence and user assignments
let tones = [
  { tone: "G4", socket: null },
  { tone: "A4", socket: null },
  { tone: "F4", socket: null },
  { tone: "F3", socket: null },
  { tone: "C4", socket: null },
]

// array of active sequence (current attempt)
let activeSequence = []

io.on("connection", socket => {
  console.log(connectedClients())
  socket.emit("assignTone", randomFreeTone(tones, socket.id).tone)
  //client stores note in sessionStorage
  console.log(tones)

  socket.on("pressed", data => {
    //client sends time and tone in data
    activeSequence.push(data.tone)
    console.log(activeSequence)
    if (activeSequence.length === tones.length) {
      if (correctSequence(tones, activeSequence)) {
        console.log("correct!")
        // client plays sequence, green flash
        io.sockets.emit("correct", activeSequence)
        // alerts to aim camera back at marker
        // redirects to A-frame page
      } else {
        io.sockets.emit("incorrect", activeSequence)
        console.log("incorrect, resetting")
        // client plays back pattern, red flash, then:
        activeSequence = []
      }
    }
  })

  socket.on("disconnect", socket => {
    // check client ids remaining and free up available tones
    unassignTone(connectedClients(), tones)
    console.log(tones)
  })

  socket.on("complete", socket => {
    // redirect to A-frame
    activeSequence = []
    console.log("resetting")
  })
})

server.listen(3000)
