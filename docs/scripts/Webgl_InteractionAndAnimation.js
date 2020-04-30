"use strict";

function canvasPosToGLPos(offsetX,offsetY,envir){
    let canvas=envir.cnv;
    let w=canvas.clientWidth;
    let h=canvas.clientHeight;
    let x=(offsetX-w/2)/(w/2);
    let y=(h/2-offsetY)/(h/2);
    let t = [2*event.clientX/canvas.width-1,
        2*(canvas.height-event.clientY)/canvas.height-1];
        return [x,y];
}
function FunctionPackage_RotationSquares_Constructor(){
    var FunctionPackage=WebGLModuleFunctionPackageConstructor();
    FunctionPackage.produceGeometryData=function(envir){
        envir.dataSet.vPos = [
            vec3(0, 1,0),
            vec3(1, 0,0),
            vec3(-1, 0,0),
            vec3(0, -1,0)
            ];
        envir.dataSet.currentRoation=0;
    },
    FunctionPackage.sendDataToGPU=function(envir){
        envir.LocInShaders["uRoation"] = envir.gl.getUniformLocation(envir.shadersProgram, "uRoation1f");
        envir.gl.uniform1f(envir.LocInShaders["uRoation"],envir.dataSet.currentRoation);
        var vPosbuffer= envir.gl.createBuffer(); 
        envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER, vPosbuffer);
        envir.bufferIds["vPos"]=vPosbuffer;
        envir.gl.bufferData(  envir.gl.ARRAY_BUFFER, flattenArrayOfVectors( envir.dataSet.vPos),  envir.gl.STATIC_DRAW );
        this.associateCurrentDataInShaders(envir,"vPos",envir.bufferIds["vPos"]);
    },
    FunctionPackage.setup=function(_envir){
        //var _containerID=cantainerID;
        //generate mainDraw function in this closure
  
    var envir=_envir;
    var fp=this;
    fp.configureWebGL(envir);
    this.mainCallBackDraw=null;
    this.updateParam=function(){
        fp.getInput(envir);
    };
    envir.inputVar.sliderBarInput=10;
    this.updateShaders=function()
    {
        //fp.getInput(envir);
        envir.shadersProgram=configShaders(envir.gl, envir.cantainerID);
        //fp.produceGeometryData(envir);
        //fp.sendDataToGPU(envir);
        envir.LocInShaders["uRoation"] = envir.gl.getUniformLocation(envir.shadersProgram, "uRoation1f");
        fp.mainRender(envir);
    }
    this.mainRender=function(){
        var rotTheta=(envir.inputVar.sliderBarInput*2*Math.PI)/3600;
        envir.dataSet.currentRoation+=rotTheta*envir.inputVar.RotationDirection;
        //console.log( envir.dataSet.currentRoation);
        envir.gl.uniform1f(envir.LocInShaders["uRoation"], envir.dataSet.currentRoation);
        envir.gl.clear(envir.gl.COLOR_BUFFER_BIT);
        envir.gl.drawArrays(envir.gl.TRIANGLE_STRIP, 0, 4);
    }
    var mainRenderLocal=this.mainRender;
    this.myRequestAnimFrame=function(){
        window.requestAnimationFrame(mainRenderLocal);
    }
    this.updateParam();
    this.updateShaders();
    this.produceGeometryData(envir);
    this.sendDataToGPU(envir);
    //setInterval(function(){console.log("+1s")},1000);
    
    //shaderEditor UI
    envir.viewPortUIControler=ButtonToHideDivControllerConstructor(envir.cantainerID+" .btnToggleForm_viewport",envir.cantainerID+" .shaderInput",FuncPackage());
    document.querySelector(envir.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",this.updateShaders);
    //rotationspeed
    var updateRotationSpeed=function(input){
        envir.inputVar.sliderBarInput=Number(input.value);
    }
    envir.sliderBarcontroller=inputAndDisplay(envir.cantainerID+" .inputRangeElem",
                                              envir.cantainerID+" .inputDisplay1",
                                               updateRotationSpeed
                                               );
    //Rotation Direction
    envir.inputVar.RotationDirection=1;
    var RotDirBtn=document.querySelector("#RotDirectionDiv button");
    this.toggleRotationDirection=function(){
        if(envir.inputVar.RotationDirection==1){
            envir.inputVar.RotationDirection=-1;
            RotDirBtn.innerHTML="Clockwise"
        }else{
            envir.inputVar.RotationDirection=1;
            RotDirBtn.innerHTML="Reverse Clockwise"
        }
    }
    RotDirBtn.addEventListener("click",this.toggleRotationDirection);
    //FPS
    envir.inputVar.FPS=30;
    envir.inputVar.mainTimer=setInterval(this.myRequestAnimFrame,1000/30);
    var FPSselect=document.querySelector(envir.cantainerID+" select");
    this.changeFPS=function(){
        envir.inputVar.FPS=Number(this.value);
        window.clearInterval(envir.inputVar.mainTimer);
        envir.inputVar.mainTimer=setInterval(fp.myRequestAnimFrame,1000/envir.inputVar.FPS);
    }
    FPSselect.addEventListener("change",this.changeFPS);
    //key board
    envir.inputVar.preRotSPD="10";
    this.toggleStopRotation=function(){
        var sliderBar=document.querySelector(envir.cantainerID+" .inputRangeElem");
        var display=document.querySelector(envir.cantainerID+" .currentRotStatus");
        var operationSpan=document.querySelector(envir.cantainerID+" .SpacebarOperation");
        if(sliderBar.value!="0"){
            envir.inputVar.preRotSPD=sliderBar.value;
            sliderBar.value="0";
            display.style.backgroundColor="rgb(180, 100, 100)";
            display.innerHTML="Stopped";
            operationSpan.innerHTML="Resume"
        }else{
            sliderBar.value=envir.inputVar.preRotSPD;
            display.style.backgroundColor="rgb(48, 121, 48)";
            display.innerHTML="Running";
            operationSpan.innerHTML="Stop"
        }
        fp.updateParam();
    }
    this.keyEvent=[];
    this.keyEvent.push({keyCode:13,callback:fp.toggleStopRotation});
    
    }
    return FunctionPackage;
}
function FunctionPackage_MouseDraw_Constructor(){
    var FunctionPackage=WebGLModuleFunctionPackageConstructor();
    FunctionPackage.setup=function(_envir){
        var envir=_envir;
        var fp=this;
        fp.configureWebGL(envir);
  
       
        envir.inputVar.numsOfInputPoints=0;
        var gl=envir.gl;
        fp.mainRender=function(){
            if(envir.inputVar.numsOfInputPoints==0)return;
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0,envir.inputVar.numsOfInputPoints);
        }
       
        //create buffer
        envir.bufferIds["vPos"]=  envir.gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vPos"]);
        //set space
        gl.bufferData( gl.ARRAY_BUFFER, 8*maxVertexs, gl.STATIC_DRAW );
        envir.bufferIds["vColor"]=envir.gl.createBuffer();
        //using in drawTriangleStripe
        envir.inputVar.lastInputPoints=[];
        envir.inputVar.lastRandomColors=[];
        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vColor"]);
        gl.bufferData( gl.ARRAY_BUFFER, 8*maxVertexs, gl.STATIC_DRAW );
        fp.updateShadersAndAssociateData=function()
        {
            //fp.getInput(envir);
            envir.shadersProgram=configShaders(envir.gl, envir.cantainerID);
            //fp.produceGeometryData(envir);
            //fp.sendDataToGPU(envir);
            
            //associate data must be done at immediately after bindBuffer() (before next binding);
            fp.associateCurrentDataInShaders(envir,"vPos",  envir.bufferIds["vPos"]);
           
             //associate data must be done at immediately after bindBuffer();   
             fp.associateCurrentDataInShaders(envir,"vColor",envir.bufferIds["vColor"]);
            window.requestAnimationFrame( fp.mainRender);
        }
        fp.updateShadersAndAssociateData();

        envir.inputVar.coloInput=null;
        fp.drawSingleTriangle=function(pointPos){
            if( envir.inputVar.coloInput==null){
                envir.inputVar.coloInput=convertHexColorToVec3(document.querySelector(envir.cantainerID+" .colorInput").value);
            }
           
            var pointColor=envir.inputVar.coloInput;
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vPos"]);
            var flatPP=flattenVector(pointPos);
            gl.bufferSubData(gl.ARRAY_BUFFER, 3*4* envir.inputVar.numsOfInputPoints,flatPP);
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vColor"]);
            var flatPC=flattenVector(pointColor);
            gl.bufferSubData(gl.ARRAY_BUFFER, 3*4* envir.inputVar.numsOfInputPoints, flatPC);
            envir.inputVar.numsOfInputPoints++;
            if(envir.inputVar.numsOfInputPoints%3==0){
                envir.inputVar.coloInput=null;
            }
            window.requestAnimationFrame( fp.mainRender);
        }
        fp.drawOneClickSqure=function(pointPos,coloInput){
            var pointsByteLen= 3*4* envir.inputVar.numsOfInputPoints;
             var startPos=pointsByteLen-pointsByteLen%3;
            //Create Point
           
            var halfWidth= envir.inputVar.sliderBarInput;
            var a=vec3(pointPos[0]+halfWidth,pointPos[1]+halfWidth,0);
            var b=vec3(pointPos[0]+halfWidth,pointPos[1]-halfWidth,0);
            var c=vec3(pointPos[0]-halfWidth,pointPos[1]-halfWidth,0);
            var d=vec3(pointPos[0]-halfWidth,pointPos[1]+halfWidth,0);
            var vPos=[a,b,d,c,b,d];
            /*
             vPos.push(a);vPos.push(b);vPos.push(d);
             vPos.push(c);vPos.push(b);vPos.push(d);
             */
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vPos"]);
            gl.bufferSubData(gl.ARRAY_BUFFER, startPos,flattenArrayOfVectors(vPos));
            ////
            var pointColor=coloInput;
            var vColor=[pointColor,pointColor,pointColor,pointColor,pointColor,pointColor];
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vColor"]);
            gl.bufferSubData(gl.ARRAY_BUFFER, startPos, flattenArrayOfVectors(vColor));
            envir.inputVar.numsOfInputPoints+=6;
            window.requestAnimationFrame( fp.mainRender);
        }
        fp.drawTriangleStripe=function(pointPos,coloInput){
          if( envir.inputVar.lastInputPoints.length<2){
            envir.inputVar.lastInputPoints.push(pointPos);
            
            return ;
          }else{

            var pointsByteLen= 3*4* envir.inputVar.numsOfInputPoints;
            var startPos=pointsByteLen-pointsByteLen%3;


              var p1=envir.inputVar.lastInputPoints[0];
              var p2=envir.inputVar.lastInputPoints[1];
              envir.inputVar.lastInputPoints[0]=p2;
              envir.inputVar.lastInputPoints[1]=pointPos;
              var vPos=[p1,p2,pointPos];
              vPos.push();vPos.push(p2);vPos.push(pointPos);
              gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vPos"]);
              gl.bufferSubData(gl.ARRAY_BUFFER, startPos,flattenArrayOfVectors(vPos));
              ///
              var vColor=[coloInput,coloInput,coloInput];
              gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vColor"]);
              gl.bufferSubData(gl.ARRAY_BUFFER, startPos, flattenArrayOfVectors(vColor));
              envir.inputVar.numsOfInputPoints+=3;
              window.requestAnimationFrame( fp.mainRender);
          }
        }
        fp.drawTwoClickSqure=function(pointPos,coloInput){
            if( envir.inputVar.lastInputPoints.length<1){
              envir.inputVar.lastInputPoints.push(pointPos);
              return ;
            }else{
                var pointsByteLen= 3*4* envir.inputVar.numsOfInputPoints;
                var startPos=pointsByteLen-pointsByteLen%3;
               //Create Point
              
               var d=envir.inputVar.lastInputPoints[0];
               var b=pointPos;
               var a=vec3(b[0],d[1],0);
               var c=vec3(d[0],b[1],0);
               envir.inputVar.lastInputPoints=[];
               var vPos=[a,b,d,c,b,d];
              /*
               vPos.push(a);vPos.push(b);vPos.push(d);
               vPos.push(c);vPos.push(b);vPos.push(d);
               */
              
               gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vPos"]);
               gl.bufferSubData(gl.ARRAY_BUFFER, startPos,flattenArrayOfVectors(vPos));
               ////
               var pointColor=coloInput;
               var vColor=[pointColor,pointColor,pointColor,pointColor,pointColor,pointColor];
               gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vColor"]);
               gl.bufferSubData(gl.ARRAY_BUFFER, startPos, flattenArrayOfVectors(vColor));
               envir.inputVar.numsOfInputPoints+=6;
               window.requestAnimationFrame( fp.mainRender);
            }
          }
        envir.inputVar.polygonInput=[];
        fp.pre_drawPolygon=function(pointPos){
            envir.inputVar.polygonInput.push(pointPos);
        }
        fp.drawPolygon=function(){
            if( envir.inputVar.polygonInput.length<3){ envir.inputVar.polygonInput=[];return;} ;
                  var pointsByteLen= 3*4* envir.inputVar.numsOfInputPoints;
                  var startPos=pointsByteLen-pointsByteLen%3;
                 //Create Point
                 var coloInput=convertHexColorToVec3(document.querySelector(envir.cantainerID+" .colorInput").value);
                 var Points=envir.inputVar.polygonInput;
                 var vPos=[];
                 var vColor=[];
                 for(var i=2;i<Points.length;i++){
                    vPos.push(Points[0]);vPos.push(Points[i-1]);vPos.push(Points[i]);
                    vColor.push(coloInput);vColor.push(coloInput);vColor.push(coloInput);
                    envir.inputVar.numsOfInputPoints+=3;
                 }
                /*
                 vPos.push(a);vPos.push(b);vPos.push(d);
                 vPos.push(c);vPos.push(b);vPos.push(d);
                 */
                
                 gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vPos"]);
                 gl.bufferSubData(gl.ARRAY_BUFFER, startPos,flattenArrayOfVectors(vPos));
                 ////
                 gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vColor"]);
                 gl.bufferSubData(gl.ARRAY_BUFFER, startPos, flattenArrayOfVectors(vColor));
                 //envir.inputVar.numsOfInputPoints+=Points.length-2;
                 envir.inputVar.polygonInput=[];
                 window.requestAnimationFrame( fp.mainRender);
        }
        fp.clickCanvasEvent=function(){
            var pointPos=canvasPosToGLPos(event.offsetX,event.offsetY,envir);
            var coloInput=convertHexColorToVec3(document.querySelector(envir.cantainerID+" .colorInput").value);
            var selection=document.querySelector(envir.cantainerID+" select").value;
            if(selection=="Single Triangle"){
                fp.drawSingleTriangle(pointPos,coloInput);
             }
             if(selection=="One Click Squre"){
                fp.drawOneClickSqure(pointPos,coloInput);
             }
             if(selection=="Triangle Stripe"){
                fp.drawTriangleStripe(pointPos,coloInput);
             }
             if(selection=="Two Click Squre"){
                fp.drawTwoClickSqure(pointPos,coloInput);
             }
             if(selection=="Polygon"){
                fp.pre_drawPolygon(pointPos,coloInput);
             }
        }
        
        fp.clearCanvas=function(){
            envir.gl.clear(envir.gl.COLOR_BUFFER_BIT);
            envir.inputVar.numsOfInputPoints=0;
         }
        //UI 
        envir.cnv.addEventListener("click",fp.clickCanvasEvent);
        document.querySelector(envir.cantainerID+" .currentRotStatus").style.display="none";
        document.querySelector(envir.cantainerID+" .polygonNote").style.display="none";
        document.querySelector(envir.cantainerID+" .inputRange").style.display="none";
        document.querySelector(envir.cantainerID+" .btn-info").onclick=fp.drawPolygon;
        document.querySelector(envir.cantainerID+" .btn-danger").onclick= fp.clearCanvas;
        envir.viewPortUIControler=ButtonToHideDivControllerConstructor(envir.cantainerID+" .btnToggleForm_viewport",envir.cantainerID+" .shaderInput",FuncPackage());
        document.querySelector(envir.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",fp.updateShadersAndAssociateData);
        envir.inputVar.sliderBarInput=0.04;
        var updateSqureSize=function(input){
            envir.inputVar.sliderBarInput=Number(input.value)/100;
        }
        document.querySelector(envir.cantainerID+" select").onchange=function(){
            var selection=this.value;
            envir.inputVar.coloInput=null;
            envir.inputVar.lastInputPoints=[];
            if(selection!="One Click Squre"){
                document.querySelector(envir.cantainerID+" .inputRange").style.display="none";
             }else{
                document.querySelector(envir.cantainerID+" .inputRange").style.display="block";
             }
             if(selection!="Polygon"){
                document.querySelector(envir.cantainerID+" .polygonNote").style.display="none";
             }else{
                document.querySelector(envir.cantainerID+" .polygonNote").style.display="block";
             }
        }
        envir.sliderBarcontroller=inputAndDisplay(envir.cantainerID+" .inputRangeElem",
                                                  envir.cantainerID+" .inputDisplay1",
                                                  updateSqureSize
              
                                                  );
        //keyEvent
        
        fp.keyEvent=[{keyCode:27,callback:fp.clearCanvas},{keyCode:18,callback: fp.drawPolygon}];
      
    }
    return FunctionPackage;
}
var WebGLModuleController={};



window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    var keyEvent=[];
   
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_1",FunctionPackage_RotationSquares_Constructor(),keyEvent);
    WebGLModuleController["WebGLModule_2"]=WebGLModuleControllerConstructor("WebGLModule_2",FunctionPackage_MouseDraw_Constructor(),keyEvent);
    //settingCanvas();
    window.addEventListener("keydown",buildKeyEvent(keyEvent));    
}



///






