'use strict';

window.requestAnimationFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();
  
  var socket = io();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var keys = [];
  var bullets = [];
  var otherPlayers=[];
  var player = {
    x:350,
    y:350,
    width:50,
    height:26,
    xVol:0,
    yVol:0,
    speed:10,
    turnSpeed:8,
    angle:0,
    shot:false,
    totalBullets:0
  };
  var Images = {};
  var d = new Date();
  var date = d.getTime();
  var oldDate = date;
  
  var otherPlayer = [];
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  socket.on('tankData',function(data){
    otherPlayers = data;
  })
  socket.on('clientId',function(data) {
    player.id = data;
  })
  socket.on('bullets', function(data){
    bullets=data;
  })


function loadImages(list){
    var total = 0;
    for(var i = 0; i < list.length; i++){
        var img = new Image();
        Images[list[i].name] = img;
        img.onload = function(){
            total++;
            if(total == list.length){
            }
        };
        img.src = list[i].url;
    }
}

function loadAssets(){
    var images = loadImages([
    {
        name: "1",
        url: "Resources/tank.png"
    },{
        name: "2",
        url: ""
    }
    ]);
}

function drawImage(x,y,width,height,img,angle){
    ctx.save();
    ctx.translate(x, y); 
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-x, -y); 
    ctx.drawImage(Images[img], x-width/2, y-height/2, width, height);
    ctx.restore(); 
}

function drawObject(width, height, x, y, angle) {
    ctx.save();
    ctx.translate(x, y); 
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillRect(width / -2, height / -2, width, height);
    ctx.restore(); 
  
}

function crtBullet(){
  socket.emit("newBullet", {
    x: player.x,
    y: player.y,
    angle: player.angle,
    player: player.id,
    time: 0
  })
}



setInterval(function calculateValues(){
  d = new Date();
  date = d.getTime();

  // Keylistener
  if(keys[65] || keys[37]){
    player.angle -= player.turnSpeed;
  }
  if(keys[68] || keys[39]){
    player.angle += player.turnSpeed;
  }
  if(!keys[65] && !keys[337] && !keys[68] && !keys[39]){
    player.xVol = 0;
  }
  if(!keys[87] && !keys[38] && !keys[83] && !keys[40]){
    player.yVol = 0;
  }

  // Move in the direction of the tank or a point in front of it
  player.dirX = 75*Math.cos(player.angle* Math.PI / 180) + player.x;
  player.dirY = 75*Math.sin(player.angle* Math.PI / 180) + player.y;

  var dx = player.dirX - player.x;
  var dy = player.dirY - player.y;
  var tempAngle = Math.atan2(dy, dx);

    if(keys[87] || keys[38]){
        player.xVol = player.speed * Math.cos(tempAngle);
        player.yVol = player.speed * Math.sin(tempAngle);
    }
    else if(keys[83] || keys[40]){
        player.xVol = -(player.speed * Math.cos(tempAngle))
        player.yVol = -(player.speed * Math.sin(tempAngle))
    }
    else{
        player.xVol=0;
        player.yVol=0;
    }
    if(keys[32]){
        if(date >= oldDate + 100){
          if(player.totalBullets <= 5) {
            player.totalBullets++
            crtBullet()
          }
          else {
            player.totalBullets = bullets.filter(bullet => bullet.player == player.id).length
            if(player.totalBullets <= 5){
              player.totalBullets++
              crtBullet()
            }
          }
          oldDate = date;
        }
    }

    player.x += player.xVol;
    player.y += player.yVol;
    
    // Send tank data to server
    socket.emit('tankPosition', player);

},1000/60);

function update() {
  console.log(bullets.length + ", " + player.totalBullets)
  ctx.clearRect(0,0,canvas.width,canvas.height);

// Draw circle around the tank
  ctx.beginPath();
  ctx.arc(player.x, player.y, 75, 0, player.angle * Math.PI / 180)
  ctx.stroke();

  if (keys[32]) {
    if (date >= oldDate + 100) {
      if (player.totalBullets <= 5) {
        player.totalBullets++
        crtBullet()
      }
      else {
        player.totalBullets = bullets.filter(bullet => bullet.player == player.id).length
        if (player.totalBullets <= 5) {
          player.totalBullets++
          crtBullet()
        }
      }
      oldDate = date;
    }
  }

    if(bullets.length > 0){
      for(let i = 0; i < bullets.length; i++){
        ctx.beginPath()
        ctx.arc(bullets[i].x, bullets[i].y, 5, 0, 2*Math.PI)
        ctx.fill()
      }
    }

// Draw other player NOTE: add support for more players
    for(var i=0; i<otherPlayers.length; i++){
        drawImage(otherPlayers[i].x, otherPlayers[i].y, otherPlayers[i].width, otherPlayers[i].height,'1', otherPlayers[i].angle);
    }

 // animate
    requestAnimationFrame(update);
      
  }

document.addEventListener('keydown', function(e){
  keys[e.keyCode] = true;
  if([65, 68, 83, 87, 37, 38, 39, 40, 32].indexOf(e.keyCode) > -1){
    e.preventDefault();
  }
})
document.addEventListener('keyup', function(e){
  keys[e.keyCode] = false;
})

window.addEventListener('load', function(){
  loadAssets();
  update();
})
