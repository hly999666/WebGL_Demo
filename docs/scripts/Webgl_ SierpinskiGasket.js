"use strict";
var WebGLModuleController={};
function WebGLModuleFunctionPackageConstructor() {
    var WebGLModuleFunctionPackageProto={
        configureWebGL:"",
        setupUI:"",
        getInput:"",
        produceGeometryData:"",
        sendDataToGPU:"",
        associateDataInShaders:"",
        mainCallBackDraw:"",
        mainRender:""
    }
    return WebGLModuleFunctionPackageProto;
}
function WebGLModuleControllerConstructor(_cantainerID,FunctionPackage) {
    var WebGLModuleControllerProto={
        envir:{
         cantainerID:"",
         dataSet:{},
         cnv:"",
         gl:"",
         shadersProgram:"",
         bufferId:"",
         inputVar:{},
         viewPortUIControler:""
        },
        FunctionPackage:{
         configureWebGL:"",
         setupUI:"",
         mainCallBackDraw:"",
         getInput:"",
         produceGeometryData:"",
         sendDataToGPU:"",
         associateDataInShaders:"",
         mainRender:""
        },
        changeFunctionPackage:function(FunctionPackage){
            this.FunctionPackage=FunctionPackage;
        }
    }
    var thisMod=WebGLModuleControllerProto;
    //settup
    thisMod.FunctionPackage=FunctionPackage;
    thisMod.envir.cantainerID="#"+_cantainerID;
    thisMod.envir.cnv = document.querySelector( thisMod.envir.cantainerID+ " .gl-canvas" );
    thisMod.envir.gl = thisMod.envir.cnv.getContext( "webgl" );
    thisMod.FunctionPackage.configureWebGL(thisMod.envir);
    thisMod.FunctionPackage.setupUI(thisMod.envir);
    return thisMod;
}


window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_1",FunctionPackage_SierpinskiGasket_TypePoint_Constructor());
    //settingCanvas();
    WebGLModuleController["WebGLModule_2"]=WebGLModuleControllerConstructor("WebGLModule_2",FunctionPackage_SierpinskiGasket_TypePolygon_Constructor());
    WebGLModuleController["WebGLModule_2"].FunctionPackage.mainCallBackDraw();

}



///






