"use strict";
var WebGLModuleController={};
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


window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    var keyEvent=[];
   
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_1",FunctionPackage_RotationSquares_Constructor(),keyEvent);
    //WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_2",FunctionPackage_MouseDraw_Constructor(),keyEvent);
    //settingCanvas();
    window.addEventListener("keydown",buildKeyEvent(keyEvent));    
}



///






