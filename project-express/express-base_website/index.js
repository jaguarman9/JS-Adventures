const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 80;

app.use(express.static(__dirname + '/public'));


io.on('connection', function(socket){

    socket.emit('startup','asdf');
	
    socket.on("disconnect", function (){

    });
});


http.listen(port, () => console.log('listening on port ' + port));
