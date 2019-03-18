var maxVertexs=1<<16;
function WebGLModuleFunctionPackageConstructor() {
    var WebGLModuleFunctionPackageProto={
        configureWebGL:function(envir){
            envir.gl.enable(envir.gl.DEPTH_TEST);
            envir.gl.viewport( 0, 0, envir.cnv.width,  envir.cnv.height);
            envir.gl.clearColor(0.8, 0.8, 0.8, 1.0);
            envir.gl.clear(envir.gl.COLOR_BUFFER_BIT);},
        setupUI:"",
        getInput:function(envir){
            var sliderBar=document.querySelector(envir.cantainerID+" .inputRangeElem");
            envir.inputVar.sliderBarInput=Number(sliderBar.value);   
            var inputDisplay1=document.querySelector(envir.cantainerID+" .inputDisplay1");
            inputDisplay1.innerText=" "+envir.inputVar.sliderBarInput;
            if(envir.inputVar.sliderBarInput<=0){
                envir.gl.clear(envir.gl.COLOR_BUFFER_BIT );
                return;
            };},
        produceGeometryData:"",
        sendDataToGPU:"",
        associateDataInShaders:function(envir,nameInShader,bufferID){
            envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  bufferID);
            envir.LocInShaders[nameInShader]= envir.gl.getAttribLocation(  envir.shadersProgram,nameInShader );
            envir.gl.vertexAttribPointer( envir.LocInShaders[nameInShader], 3,  envir.gl.FLOAT, false, 0, 0 );
            envir.gl.enableVertexAttribArray( envir.LocInShaders[nameInShader] );
        },
        associateCurrentDataInShaders:function(envir,nameInShader,bufferID){
            envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  bufferID);
            envir.LocInShaders[nameInShader]= envir.gl.getAttribLocation(  envir.shadersProgram,nameInShader );
            envir.gl.vertexAttribPointer( envir.LocInShaders[nameInShader], 3,  envir.gl.FLOAT, false, 0, 0 );
            envir.gl.enableVertexAttribArray( envir.LocInShaders[nameInShader] );
        },
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
function WebGLModuleControllerConstructor(_cantainerID,FunctionPackage,_keyEvent) {
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
    if(thisMod.FunctionPackage.keyEvent!=undefined){
        for(var i=0;i<thisMod.FunctionPackage.keyEvent.length;i++){
            _keyEvent.push(thisMod.FunctionPackage.keyEvent[i]);
           }
    }
   
    // _keyEvent.concat(_keyEvent,thisMod.FunctionPackage.keyEvent);
    return thisMod;
}
function WebGLModuleGeometricObjectConstructor(config){
    var verticeTable=[
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
        ];
    var colorTable=[
        [ 0.0, 0.0, 0.0, 1.0 ], 
        [ 1.0, 0.0, 0.0, 1.0 ], 
        [ 1.0, 1.0, 0.0, 1.0 ], 
        [ 0.0, 1.0, 0.0, 1.0 ], 
        [ 0.0, 0.0, 1.0, 1.0 ], 
        [ 1.0, 0.0, 1.0, 1.0 ],
        [ 1.0, 1.0, 1.0, 1.0 ], 
        [ 0.0, 1.0, 1.0, 1.0 ] 
            ];
    var geometricObject={};
    if(config.drawingMode=="Interpolation"){
        geometricObject.verticeData={};
        geometricObject.verticeData["vPos"]=verticeTable;
        geometricObject.verticeData["vColor"]=colorTable;
        geometricObject.triangleIndices=[];
        var quad_Indexed=function(a,b,c,d){
            _quad_Indexed(a,b,c,d, geometricObject.triangleIndices);
        }
        quad_Indexed(1, 0, 3, 2);
        quad_Indexed(2, 3, 7, 6);
        quad_Indexed(3, 0, 4, 7);
        quad_Indexed(6, 5, 1, 2);
        quad_Indexed(4, 5, 6, 7);
        quad_Indexed(5, 4, 0, 1);
    }else{
        geometricObject.verticeData={};
        geometricObject.verticeData["vPos"]=[];
        geometricObject.verticeData["vColor"]=[];
        var quad_vertexAndColor=function(a,b,c,d,color){
            _quad_vertexAndColor(a,b,c,d,color, geometricObject.verticeData["vPos"],geometricObject.verticeData["vColor"],verticeTable);
        }
        quad_vertexAndColor(1, 0, 3, 2,colorTable[0]);
        quad_vertexAndColor(2, 3, 7, 6,colorTable[1]);
        quad_vertexAndColor(3, 0, 4, 7,colorTable[2]);
        quad_vertexAndColor(6, 5, 1, 2,colorTable[3]);
        quad_vertexAndColor(4, 5, 6, 7,colorTable[4]);
        quad_vertexAndColor(5, 4, 0, 1,colorTable[5]);
    }
        geometricObject.addDataToEnvir=function(envir){
            if(envir.inputVar.DrawingMode=="radioInterpolation"){
                var indexHeader=envir.dataSet["vPos"].length;
                for(var i=0;i< geometricObject.verticeData["vPos"].length;i++){
                   envir.dataSet["vPos"].push(geometricObject.verticeData["vPos"][i]);
                }
                for(var i=0;i< geometricObject.verticeData["vColor"].length;i++){
                   envir.dataSet["vColor"].push(geometricObject.verticeData["vColor"][i]);
                }
                if(geometricObject.triangleIndices!=undefined){
                   for(var i=0;i< geometricObject.triangleIndices.length;i++){
                       envir.numVertices++;
                       envir.dataSet["elementV"].push(geometricObject.triangleIndices[i]+indexHeader);
                    }
                }
            }else{
                var indexHeader=envir.dataSet["vPos"].length;
                for(var i=0;i< geometricObject.verticeData["vPos"].length;i++){
                    envir.numVertices++;
                    envir.dataSet["vPos"].push(geometricObject.verticeData["vPos"][i]);
                 }
                 for(var i=0;i< geometricObject.verticeData["vColor"].length;i++){
                    envir.dataSet["vColor"].push(geometricObject.verticeData["vColor"][i]);
                 }
            }
                
               
        }
    return geometricObject;
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
function canvasPosToGLClippingCoord(c_x,c_y,envir){
    var cans_w=envir.cnv.clientWidth;
    var cans_h=envir.cnv.clientHeight;
   var x=-1+2*(c_x/cans_w);
   var y=1-2*(c_y/cans_h);
   return vec3(x,y,0);
}
function GLClippingCoordToUnitSphereCoord(gl_x,gl_y){
   var elevation=linearMapping(gl_y,-1,1,Math.PI,0);
   var azimuth=linearMapping(gl_x,-1,1,0,2*Math.PI);
   return [Math.cos(azimuth)*Math.sin(elevation),Math.sin(azimuth)*Math.sin(elevation),Math.cos(elevation)];
}
function GLClippingCoordToUnitSphereCoord_V2(gl_x,gl_y){
    let d=Math.sqrt(gl_x*gl_x+gl_y*gl_y);
    if(d<=1){
        return [gl_x,gl_y,Math.sqrt(1-d*d)];
    }else{
        return [gl_x/d,gl_y/d,0];
    }
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
function buildKeyEvent(keyEventList){
    if(keyEventList==undefined){
        return function(){};
    }
    var keyEventListener=function(event) {
        var key = event.keyCode;
        for(var i=0;i<keyEventList.length;i++){
            if(keyEventList[i].keyCode==key){
                keyEventList[i].callback();
            }
        }
    }
    return keyEventListener;
}
function _quad_Indexed(a, b, c, d,_indices)
{
var indices = [ a, b, c, a, c, d ];
for(var i=0;i< indices.length;i++){
    _indices.push(indices[i]);

 }
}
function _quad_vertexAndColor(a, b, c, d,color,_vertices_out,_colors_out,_vertices_table)
{
var v = [ _vertices_table[a],_vertices_table[b], _vertices_table[c], _vertices_table[a],_vertices_table[c], _vertices_table[d]];
for(var i=0;i< v.length;i++){
    _vertices_out.push(v[i]);
 }
 for(var i=0;i< v.length;i++){
    _colors_out.push(color);
 }
}
function linearMapping(value,domainMin,domainMax,coDomainMin,coDomainMax){
    var domainRange=domainMax-domainMin;
    var coDomainMinRange=coDomainMax-coDomainMin;
    return (value-domainMin)/domainRange*coDomainMinRange+coDomainMin;
}
class rotationBtnController{
    constructor(envir){
        this.rotation=[0,0,0];
        let _rotation=this.rotation;
   this.rotationBtnListener=function(){
       if(this.classList.contains("RotateX"))_rotation[0]+=3;
       if(this.classList.contains("RotateY"))_rotation[1]+=3;
       if(this.classList.contains("RotateZ"))_rotation[2]+=3;
       //envir.FunctionPackage.mainRender();
   };
   let _rotationBtnListener=this.rotationBtnListener;
   document.querySelectorAll(envir.cantainerID+" .RotateBtnDiv>.btn").forEach(
      function(btn){
       btn.addEventListener("click",_rotationBtnListener);
      }
   );
    }
    getRotationMat(){
        let rotateBtn=mat4(); 
        rotateBtn=mult(rotateBtn,rotateX_M(this.rotation[0]));
        rotateBtn=mult(rotateBtn,rotateY_M(this.rotation[1]));
        rotateBtn=mult(rotateBtn,rotateZ_M(this.rotation[2]));
        return rotateBtn;
    }
}
class trackBallUIBtnController{
    constructor(envir){
        this.canvas=envir.cnv;
        this.lastPos=[0,0,0];
        this.axis=[0,0,1];
        this.angle=0;
        this.trackingMouse=false;
        this.trackballMove=false;
        this.rotatM=mat4();
        this.mouseMotion=function(x, y)
        {
            //console.log("mouseMotion");
            let Controller=envir.inputVar["trackBallUIBtnController"];
            let dist=0;
            var curPos = GLClippingCoordToUnitSphereCoord_V2(x, y);
            if( Controller.trackingMouse) {
                dist=vectorLen(subtract(Controller.lastPos,curPos));
              if ((dist)>0.01) {
                Controller.angle = -8* dist* envir.InputVar["trackballSensitivity"];
                Controller.axis=cross( Controller.lastPos, curPos);
                Controller.lastPos=curPos;
                
              }
            }
        }
        this.startMotion=function(x, y)
        {
            //console.log("startMotion");
            let Controller=envir.inputVar["trackBallUIBtnController"];
            Controller.trackingMouse = true;
            Controller.lastPos = GLClippingCoordToUnitSphereCoord_V2(x, y);
            Controller.trackballMove=true;
        }
        this.stopMotion=function()
        {
            //console.log("stopMotion");
            let Controller=envir.inputVar["trackBallUIBtnController"];
            Controller.trackingMouse = false;
            setTimeout(function(){   
                Controller.angle = 0.0;
                Controller.trackballMove = false;
            },500);
        }
        let _startMotion= this.startMotion;
        let _mouseMotion= this.mouseMotion;
        let _stopMotion= this.stopMotion;
        this.canvas.addEventListener("mousedown",
             function(){
                envir.InputVar["trackballSensitivity"]= Number(document.querySelector(envir.cantainerID+" .inputRangeElem").value);
                 var nowPos=canvasPosToGLClippingCoord(event.offsetX,event.offsetY,envir);
                var x =nowPos[0];
                var y =nowPos[1];
                _startMotion(x, y);
             });
        this.canvas.addEventListener("mouseup",()=>_stopMotion());
        this.canvas.addEventListener("mouseleave",()=>_stopMotion());
        this.canvas.addEventListener("mousemove",
             function(){
                var nowPos=canvasPosToGLClippingCoord(event.offsetX,event.offsetY,envir);
                var x =nowPos[0];
                var y =nowPos[1];
                _mouseMotion(x, y);
             });

    }
    getRotationMat(envir){
      
        let controller=envir.inputVar["trackBallUIBtnController"];
        let rotationAxisMatrix=controller.rotatM;
        if(controller.trackballMove||controller.trackingMouse)console.log(controller)
        if(controller.trackballMove&&vectorLen(controller.axis)!=0) {
            //console.log("angle :"+angle+". axis:"+axis);
            controller.axis = normalize(controller.axis);
            rotationAxisMatrix = mult(rotateM(controller.angle, controller.axis),rotationAxisMatrix);
          }
          envir.inputVar["trackBallUIBtnController"].rotatM=rotationAxisMatrix;
          return rotationAxisMatrix;
    }
}