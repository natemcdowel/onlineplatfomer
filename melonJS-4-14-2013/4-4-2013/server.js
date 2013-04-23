var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/'));

server.listen(8080); 

var clientid = '';
var users = Array();
io.sockets.on('connection', function (socket) {

  // Setting name AND setting position
  socket.on('setname', function(userName) {   
    var usernumber = users.length;
    users[usernumber] = new Array();  
    users[usernumber][1] = Math.floor((Math.random()*1000)+1);
    // users[usernumber][2] = Math.floor((Math.random()*600)+1);  
    users[usernumber][3] = userName;

    console.log(users);
    io.sockets.emit('getplayers', users);  
  });

  // Passes all player position information from client to be set in server  
  socket.on('syncplayers', function(user) {  
    users = user;  
    console.log(users);
  }); 

  // Listens for keypress and sends back to client
  socket.on('keypress', function (data) {
    io.sockets.emit('playermove', data[0], data[1]);  
    console.log(data[2]); // X position
  });  

  // Listens for keypress and sends back to client
  socket.on('destroy', function (data) {
    io.sockets.emit('destroys', data);  
    console.log(data); // X position       
  });    

  // Listens for clients leaving game
  socket.on('leave', function (userName) {

    var l = users.length;
    for (var i = 0; i < l; i++) {
      if (users[i][3] == userName) {
        clientid = i;
      }
    }  
    users.splice(clientid, 1);
    console.log(users);
    io.sockets.emit('getplayers', users); 
    io.sockets.emit('removeplayer', clientid); 
    io.sockets.emit('playermove', '45', clientid); // To update without keypress on client 
  }); 
});  
