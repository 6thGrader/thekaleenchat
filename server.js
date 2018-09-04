var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/client.html');
});

var count=1;
io.on('connection', function(socket) {
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);
  io.emit('receive message', name+'님이 입장하셨습니다.');

  socket.on('disconnect', function() {
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text) {
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('server on!');
});