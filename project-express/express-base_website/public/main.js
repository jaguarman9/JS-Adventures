'use strict';

// changeing requestAnimationFrame to work with all browsers
window.requestAnimationFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame
    );
}();

var socket = io();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var openPages =[];

var width = window.innerWidth;
var height = window.innerHeight;

var pageX = width*.18;
var pageY = height*.06;

var nextPagePos = width*.18;

var menu = [
    {name:'registers',pageId:'1'},
    {name:'desk',pageId:'2'},
    {name:'name',pageId:'3'},
    {name:'employes',pageId:'4'}
];

canvas.width = width;
canvas.height = height;

socket.on('startup',(data)=>{

})

//file picker #232321
//selected page #2B2C27
//unselected page #43443E
//unselected text  #D3D4CF

function update(){
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(pageX,0,width,pageY);

    ctx.fillStyle = '#2B2C27'
    ctx.fillRect(pageX,pageY,width,height);

    

    for(let i=0;i<openPages.length;i++){
        ctx.font = "15px Helvetica";
        let stringWidth = ctx.measureText(openPages[i].name).width
        if(stringWidth<100){stringWidth = 100;}
        if(stringWidth>200){stringWidth = 200;}

        if(openPages[i].open){
            ctx.fillStyle = '#2B2C27'
            ctx.fillRect(openPages[i].x,0,stringWidth+34,pageY);
            ctx.fillStyle = '#f2f2f2'
            ctx.fillRect(openPages[i].x,(pageY)-1,stringWidth+34,1);
            ctx.fillStyle = '#f2f2f2'
            ctx.fillText(openPages[i].name, openPages[i].x+17, ((pageY) /2)+6);
        }
        else{
            ctx.fillStyle = '#43443E'
            ctx.fillRect(openPages[i].x,0,stringWidth+34,pageY);
            ctx.fillStyle = '#D3D4CF'
            ctx.fillText(openPages[i].name, openPages[i].x+17, ((pageY) /2)+6);
        }
    }

    for(let i=0;i<menu.length;i++){
        ctx.font = "15px Helvetica";

        ctx.fillStyle = '#D3D4CF'
        ctx.fillRect(0,(i*(pageY+5))+pageY,pageX-1,pageY+4)
        ctx.fillStyle = '#000'
        ctx.fillText(menu[i].name,5, (i*(pageY+5))+(pageY+7)+pageY/2);
    }

    requestAnimationFrame(update);
}

function newPage(value){
    for(let i=0;i<openPages.length;i++){
        openPages[i].open=false;
    }

    let stringWidth=ctx.measureText(value).width;

    if(stringWidth<100){stringWidth= 135;}
    else if(stringWidth>200){stringWidth = 235;}
    else{stringWidth = stringWidth+35;}

    openPages.push({name:value,open:true,x:nextPagePos,width:stringWidth});

    nextPagePos += stringWidth;
}

document.addEventListener('mousedown',(e)=>{

})
document.addEventListener('mouseup',(e)=>{
    if(e.clientX>pageX&&e.clientY>pageY){
        newPage('asdf')
    }
    else{
        for(let i=0;i<openPages.length;i++){
            if(e.clientX>=openPages[i].x&&e.clientX<openPages[i].x+openPages[i].width){
                if(e.clientY>=0&&e.clientY<height*.06){
                    for(let t=0;t<openPages.length;t++){openPages[t].open=false;}
                    openPages[i].open=true;
                }
            }
        }
    }

    if(e.clientX>=0&&e.clientX<pageX){
        for(let i=0;i<menu.length;i++){
            
        }
    }


})
document.addEventListener('keydown',(e)=>{

})
document.addEventListener('keyup',(e)=>{

})
window.addEventListener('load',()=>{
    update();
})

