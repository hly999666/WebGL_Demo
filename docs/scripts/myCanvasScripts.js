console.log("scriptCanvas_OK")
var canv;
var ctx;
window.onload=function(){
    canv=document.querySelector("#myCan");
    ctx=canv.getContext("2d");
    /*
    canv.addEventListener("mousemove",function(e){
        console.log(e);
        console.log(this);
          //console.log((e.pageX-this.offsetLeft)+" "+(e.pageY-this.offsetTop));
    });
    */
   //$("#doge").hide();
}
function shadowRect(){
    ctx.fillStyle="blue";
ctx.rect(50,50,60,60);
ctx.shadowBlur=10;
ctx.shadowColor="#555555";
ctx.shadowOffsetX=5;
ctx.shadowOffsetY=5;
ctx.fill();
}
function drawLine(){
    ctx.fillStyle="White";
  ctx.beginPath();
  ctx.moveTo(60,60);
  ctx.lineTo(60,80);
  ctx.lineTo(80,90);
  ctx.closePath();
  ctx.fill();
}
function arcLine(){
    ctx.fillStyle="#999999";
   ctx.arc(220,150,50,0,(Math.PI)*2,false);
   ctx.fill();
   ctx.stroke();
  //ctx.closePath();
}
function drawCurve(){
    ctx.fillStyle="#999999";
    ctx.beginPath();
    ctx.moveTo(300,350);
    ctx.bezierCurveTo(300,400,450,400,600,200)
    ctx.stroke();
    ctx.closePath();
  // ctx.fill();

  //ctx.closePath();
}
function Loop(){
    
    ctx.lineWidth=3;
    
    for(var i=0;i<10;i++){
    ctx.beginPath();
    ctx.moveTo(300,350);
    ctx.bezierCurveTo(300,400,450+i*10,400+i*10,600,200)
    ctx.stroke();
    ctx.closePath();
    }
  // ctx.fill();

  //ctx.closePath();
}

function testInterval(x,str){
    setInterval(function(){
    console.log(str);
    },x);
}
function addText(str){
    ctx.fillStyle="Blue";
    ctx.font='50px Arial';
    ctx.fillText(str,50,50,200);
}
function addImg(){
    var img=new Image();
    //img.src="./images/doge.jpg";//Method 1;
    var myImg=$("#doge")[0];
    ctx.drawImage(myImg,0,0);
    // img.onload=function(){
    //     ctx.drawImage(img,0,0);
    // }
    // img.src=myImg.src;//Method 2;
}
function addImgResize(scale){
    var img=new Image();
    //img.src="./images/doge.jpg";//Method 1;
    var myImg=$("#doge")[0];
    ctx.drawImage(myImg,0,0,scale,scale);
    // img.onload=function(){
    //     ctx.drawImage(img,0,0);
    // }
    // img.src=myImg.src;//Method 2;
}
function addImgSlice(){
    var img=new Image();
    //img.src="./images/doge.jpg";//Method 1;
    var myImg=$("#doge")[0];
    ctx.drawImage(myImg,100,100,200,200,0,0,200,200);
    // img.onload=function(){
    //     ctx.drawImage(img,0,0);
    // }
    // img.src=myImg.src;//Method 2;
}