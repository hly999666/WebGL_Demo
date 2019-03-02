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
        bufferIds:{},
        LocInShaders:{},
        inputVar:{},
        viewPortUIControler:""
       }
    return envir;
}
function WebGLModuleControllerConstructor(_cantainerID,FunctionPackage) {
    var WebGLModuleControllerProto={
        envir:WebGLModuleEnvironmentConstructor(),
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
    thisMod.envir.gl = thisMod.envir.cnv.getContext( "webgl", {
        antialias: true
      });
    thisMod.FunctionPackage.setup(thisMod.envir);
    return thisMod;
}

function configShaders(gl,cantainerID){
    updateTextArea(cantainerID+" .vertexShader");updateTextArea(cantainerID+" .fragmentShader");
    var shadersProgram = loadShaders( gl, cantainerID+" .vertexShader",cantainerID+" .fragmentShader" );
    gl.useProgram( shadersProgram );
    return shadersProgram;
}
function loadShaders(gl, vertexShaderQ, fragmentShaderQ){
    var vertShdr;
    var fragShdr;
    var vertElem =document.querySelector(vertexShaderQ).innerHTML;
    vertShdr = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vertShdr, vertElem);
    gl.compileShader( vertShdr );
    var fragElem =document.querySelector(fragmentShaderQ).innerHTML;
    fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fragShdr, fragElem);
    gl.compileShader( fragShdr );
    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    return program;
}
function canvasPosToGLPos(c_x,c_y,envir){
    var cans_w=envir.cnv.clientWidth;
    var cans_h=envir.cnv.clientHeight;
   var x=-1+2*(c_x/cans_w);
   var y=1-2*(c_y/cans_h);
   return vec3(x,y,0);
}
function randomVec3(){
    var x=Math.random();
    var y=Math.random();
    var z=Math.random();
    return vec3(x,y,z);
}
function convertHexColorToVec3(hex){
   var r=HexToNumber(hex[1]+hex[2])/255;
   var g=HexToNumber(hex[3]+hex[4])/255;
   var b=HexToNumber(hex[5]+hex[6])/255;
   return vec3(r,g,b);
}
function HexToNumberOne(hex){
    if(hex=='a')return 10;
    if(hex=='b')return 11;
    if(hex=='c')return 12;
    if(hex=='d')return 13;
    if(hex=='e')return 14;
    if(hex=='f')return 15;
    return Number(hex);
}
function HexToNumber(hex){
    var ans=0;var base=1;var len=hex.length-1;
    for(var i=len;i>=0;i--) {
        ans+=base*HexToNumberOne(hex[i]);base*=16;
    }
    return ans;
}