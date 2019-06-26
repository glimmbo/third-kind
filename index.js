const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const randomFreeTone = require("./randomFreeTone")
const unassignTone = require("./unassignTone")
const correctSequence = require("./correctSequence")

app.use(express.static("public"));

const connectedClients = () => {
  return Object.keys(io.sockets.connected)
};

function capacity(req, res, next) {
  console.log('capacity middleware')
  if (connectedClients().length <= 4) {
    next();
  } else {
    res.sendFile(__dirname + '/public/busy.html');
  }
};

app.use(capacity);

app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/index.html");
});

// array of correct sequence and user assignments
let tones = [
  { tone: "G", socket: null },
  { tone: "A", socket: null },
  { tone: "hiF", socket: null },
  { tone: "loF", socket: null },
  { tone: "C", socket: null },
];

// array of active sequence (pattern attempt)
let activeSequence = [];

// keep clients from disconnecting
function sendHeartbeat(){
  setTimeout(sendHeartbeat, 8000);
  io.sockets.emit('ping', { beat : 1 });
}
setTimeout(sendHeartbeat, 8000);

io.on("connection", function(socket) {
  console.log(connectedClients());
  socket.emit("assignTone", randomFreeTone(tones, socket.id).tone);
  //client stores note in sessionStorage
  console.log(tones);

  socket.on("pressed", data => {
    //client sends time and tone in data
    activeSequence.push(data.tone);
    console.log(activeSequence);
    if (activeSequence.length === tones.length) {
      if (correctSequence(tones, activeSequence)) {
        console.log('correct!'); // play win animation
      } else {
        console.log('incorrect, resetting'); // flash all screens red
        io.sockets.emit('incorrect', activeSequence) // play back pattern
        activeSequence = [];
      };
    }
  });

  socket.on("disconnect", function(socket) {
    // check client id's remaining and free up available tones
    unassignTone(connectedClients(), tones);
    console.log(connectedClients());
    console.log(tones);
  });
});

app.listen(3000, () => {
  console.log('app listening on 3000')
});

http.listen(3001, function(socket) {
  console.log("io listening on 3001");
  console.log(connectedClients());
});