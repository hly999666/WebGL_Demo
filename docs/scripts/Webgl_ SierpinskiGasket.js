"use strict";
var WebGLModuleController={};
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
    mainDraw:"",
    getInput:"",
    produceGeometryData:"",
    sendDataToGPU:"",
    associateDataInShaders:"",
    mainRender:""
   },
    setup: function(_cantainerID,FunctionPackage){
    this.FunctionPackage=FunctionPackage;
    this.envir.cantainerID="#"+_cantainerID;
    this.envir.cnv = document.querySelector( this.envir.cantainerID+ " .gl-canvas" );
    this.envir.gl = this.envir.cnv.getContext( "webgl" );
    this.FunctionPackage.configureWebGL(this.envir);
    this.FunctionPackage.setupUI(this.envir);
    },
    changeFunctionPackage:function(FunctionPackage){
        this.FunctionPackage=FunctionPackage;
    }
}


window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    WebGLModuleController["WebGLModule_1"]=Object.create(WebGLModuleControllerProto);
    WebGLModuleController["WebGLModule_1"].setup("WebGLModule_1",FunctionPackage_SierpinskiGasket_Type_Point);
    //settingCanvas();
    
}



///






