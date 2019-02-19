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
function WebGLModuleEnvironmentConstructor() {
    var envir={
        cantainerID:"",
        dataSet:{},
        cnv:"",
        gl:"",
        shadersProgram:"",
        bufferId:"",
        inputVar:{},
        viewPortUIControler:""
       }
    return envir;
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