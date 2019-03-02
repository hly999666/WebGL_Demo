"use strict";
var WebGLModuleController={};



window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    var keyEvent=[];
   
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_1",FunctionPackage_RotationSquares_Constructor(),keyEvent);
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_2",FunctionPackage_MouseDraw_Constructor(),keyEvent);
    //settingCanvas();
    window.addEventListener("keydown",buildKeyEvent(keyEvent));    
}



///






