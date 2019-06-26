const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const randomFreeTone = require("./randomFreeTone")
const unassignTone = require("./unassignTone")

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

let tones = [
  { name: "G", socket: null },
  { name: "A", socket: null },
  { name: "hiF", socket: null },
  { name: "loF", socket: null },
  { name: "C", socket: null },
];

// keep clients from disconnecting
function sendHeartbeat(){
  setTimeout(sendHeartbeat, 8000);
  io.sockets.emit('ping', { beat : 1 });
}
setTimeout(sendHeartbeat, 8000);

io.on("connection", function(socket) {
  console.log(connectedClients());
  socket.emit("assignTone", randomFreeTone(tones, socket.id).name);
  //client stores note in sessionStorage
  console.log(tones);

  socket.on("pressed", data => {
    //client sends time and tone in data
    console.log(socket.client.id, data);
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