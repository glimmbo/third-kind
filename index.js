const express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/', function(req, res){
  //loads html
  res.sendFile(__dirname + '/index.html');
});

// need routes for each AR tag to have separate colors?

io.on('connection', function(socket){
  console.log('connection made');
  socket.on('button pressed', data => {
    
    console.log(data);
  })
});

http.listen(3000, function(socket){
  console.log('listening on *:3000');
});

