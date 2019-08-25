window.requestAnimationFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height= window.innerHeight;

var mouse={};

var win1={
  x:200,
  y:10,
  width:250,
  height:250
}

var win2={
  x:100,
  y:100,
  width:250,
  height:250
}

var windows=[
  win1,win2
]

function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<windows.length;i++){
    drawWindow(windows[i].x,windows[i].y,windows[i].width,windows[i].height)
  }

  requestAnimationFrame(update);
}

function drawLine(x1,y1,x2,y2){
  ctx.fillStyle='black';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawWindow(x,y,width,height){
  drawLine(x,y,x+width,y);
  drawLine(x,y,x,y+height);
  drawLine(x+width,y,x+width,y+height);
  drawLine(x,y+height,x+width,y+height);
  ctx.fillStyle = 'black';
  ctx.fillRect(x,y,width,20);
  ctx.fillStyle = 'white';
  ctx.fillRect(x+1,y+20,width-2,height-22);
  
}

function getWindow(x,y){
  for(let i=0;i<windows.length;i++){
    if(x>=windows[i].x&&x<=windows[i].x+windows[i].width){
      if(y>=windows[i].y&&y<=windows[i].y+20){
        if (i < windows.length-1) {
          let cutArr = windows.splice(i, 1);
          windows.push(cutArr[0]);
          return windows.length-1;
        }
        else{
          return i;
        }
      }
      else if(y>=windows[i].y&&y<=windows[i].y+windows[i].height){
        let cutArr = windows.splice(i, 1);
        windows.push(cutArr[0]);
      }
    }
  }
}

function getResize(x,y){
  for(let i=0;i<windows.length;i++){
    if(x>=windows[i].x-4&&x<=windows[i].x+4){
      if(y>=windows[i].y+20&&y<=windows[i].y+windows[i].height){
        canvas.style.cursor='ew-resize';
        mouse.resize={page:i,value:true};
      }
    }
    else{
      canvas.style.cursor='default';
      mouse.resize={value:false};
    }
  }
}

document.addEventListener('mousedown',function(e){
  mouse.downX=e.clientX;
  mouse.downY=e.clientY;
  mouse.pageOn=getWindow(e.clientX,e.clientY);
  mouse.down=true;

});
document.addEventListener('mouseup',function(){
  mouse.down=false;
});
document.addEventListener('mousemove',function(e){
  getResize(e.clientX,e.clientY);
  if(mouse.down&&mouse.pageOn!=null){

    mouse.newX=e.clientX;
    mouse.newY=e.clientY;

    mouse.xDif = mouse.newX-mouse.downX;
    mouse.yDif = mouse.newY-mouse.downY;

    windows[mouse.pageOn].x += mouse.xDif;
    windows[mouse.pageOn].y += mouse.yDif;

    mouse.downX = mouse.newX;
    mouse.downY = mouse.newY;
  }
});

window.addEventListener('load',function(){
  update();
})