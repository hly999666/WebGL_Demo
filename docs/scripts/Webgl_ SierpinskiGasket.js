"use strict";
var WebGLModuleController={};



window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_1",FunctionPackage_SierpinskiGasket_TypePoint2D_Constructor());
    //settingCanvas();
    WebGLModuleController["WebGLModule_2"]=WebGLModuleControllerConstructor("WebGLModule_2",FunctionPackage_SierpinskiGasket_TypePolygon2D_Constructor());
    WebGLModuleController["WebGLModule_2"].FunctionPackage.mainCallBackDraw();
    WebGLModuleController["WebGLModule_2"]=WebGLModuleControllerConstructor("WebGLModule_3",FunctionPackage_SierpinskiGasket_TypePoint3D_Constructor());

}



///






