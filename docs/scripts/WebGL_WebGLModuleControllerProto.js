

function WebGLModuleControllerConstructor(cantainerID,FunctionPackage){
    var WebGLModuleController={
        envir:{
         cantainerID:"",
         dataSet:{},
         cnv:"",
         gl:"",
         shadersProgram:"",
         bufferId:"",
         inputVar:{},
         viewPortUIControler:""},
        FunctionPackage:{
         configureWebGL:"",
         setupUI:"",
         mainDraw:"",
         getInput:"",
         produceGeometryData:"",
         sendDataToGPU:"",
         associateDataInShaders:"",
         mainRender:""},
         changeFunctionPackage:function(_envir,_FunctionPackage){
            this.FunctionPackage=_FunctionPackage;
            this.envir=_envir;
         }
         };
         WebGLModuleController.FunctionPackage=FunctionPackage;
         WebGLModuleController.envir.cantainerID="#"+cantainerID;
         WebGLModuleController.envir.cnv = document.querySelector( WebGLModuleController.envir.cantainerID+ " .gl-canvas" );
         WebGLModuleController.envir.gl = WebGLModuleController.envir.cnv.getContext( "webgl" );
         WebGLModuleController.FunctionPackage.configureWebGL(WebGLModuleController.envir);
         WebGLModuleController.FunctionPackage.setupUI(WebGLModuleController.envir);
         return WebGLModuleController;
}