var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/'));

server.listen(80); 

var clientid = '';
var users = Array();
var i = 0;
io.sockets.on('connection', function (socket) {

  // Creating player array
  socket.emit('assignid',i);
  users[i] = Array();
  users[i][0] = '';
  users[i][1] = i;
  users[i][2] = 75;
  users[i][3] = 100;
  users[i][4] = 8;  
  i++

  // Setting name AND setting position
  // socket.on('setname', function(userName) {   
  //   var usernumber = users.length;
  //   users[usernumber] = new Array();  
  //   users[usernumber][1] = Math.floor((Math.random()*1000)+1);
  //   // users[usernumber][2] = Math.floor((Math.random()*600)+1);  
  //   users[usernumber][3] = userName;
  //   console.log(users); 
  //   io.sockets.emit('getplayers', users);   
  // });
 
  // Listens for keypress and sends back to client
  socket.on('keypress', function (data) {
    //io.sockets.emit('playermove', data[0], data[1], data[2], data[3], data[4]);  
    // Storing users current map screen
    users[data[1]][1]=data[1]; 
    users[data[1]][2]=data[2];  
    users[data[1]][3]=data[3]; 
    // throw new Error(users);  
    //console.log('x:' + data[2] + ' y:' + data[3] + ' map:' + data[4]); // X position  
  });  
  
  // Listens for destroy and sends back to client
  socket.on('destroy', function (data) {
    io.sockets.emit('destroys', data);  
    //console.log(data); // X position        
  });    

  // Checks for players on current map screen
  socket.on('checkmapserver', function (clientid) {

    socket.emit('checkmapclient', users);      
  });       

  // Changes map in server for selectec clientid 
  socket.on('changemapserver', function (socketArray) {
    // Setting map into appropriate player 
    users[socketArray[0]][4] = socketArray[1];  
     
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

  // Updates player positions to client every so often
  setInterval(function(){
    io.sockets.emit('updateclientpos',users);   
  }, 10);  
});  
