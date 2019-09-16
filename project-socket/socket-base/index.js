const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log(msg)
      io.emit('chat message', msg);
    });
});

http.listen(port, () => console.log('listening on port ' + port));
