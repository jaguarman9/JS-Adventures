const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 80;
const shortid = require('shortid');
 
var players=[];
var bullets=[];

app.use(express.static(__dirname + '/public'));


setInterval(function(){
    if (bullets) {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].dirX = 75 * Math.cos(bullets[i].angle * Math.PI / 180) + bullets[i].x;
            bullets[i].dirY = 75 * Math.sin(bullets[i].angle * Math.PI / 180) + bullets[i].y;

            bullets[i].dx = bullets[i].dirX - bullets[i].x;
            bullets[i].dy = bullets[i].dirY - bullets[i].y;
            bullets[i].tempAngle = Math.atan2(bullets[i].dy, bullets[i].dx);

            bullets[i].xVol = 10 * Math.cos(bullets[i].tempAngle);
            bullets[i].yVol = 10 * Math.sin(bullets[i].tempAngle);

            bullets[i].x += bullets[i].xVol;
            bullets[i].y += bullets[i].yVol;

            bullets[i].time++
            if(bullets[i].time >= 300){
                bullets.splice(i, 1)
            }
        }    
    }
    io.sockets.emit("bullets", bullets)
}, 1000/60);

io.on('connection', function(socket){
	var clientId = shortid.generate();
	socket.emit('clientId',clientId);
	players.push({id:clientId});
    socket.on('tankPosition', (data) => {
    	var tempIndex = players.map(function(x) {return x.id; }).indexOf(data.id);

    	players[tempIndex]=data;

    	io.sockets.emit('tankData', players);
    });
    socket.on("newBullet", function (e) {
        bullets.push(e)
    })

    // Check for client disconnection and remove them from the player array
    socket.on("disconnect", function (){
        var tempIndex = players.map(function(x) {return x.id; }).indexOf(clientId);

        players.splice(tempIndex, 1);
    });

});


http.listen(port, () => console.log('listening on port ' + port));
