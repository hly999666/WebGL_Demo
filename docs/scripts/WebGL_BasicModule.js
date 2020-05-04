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
        viewPortUIControler:"",
        lightData:[]
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
function convertHexColorToVec4(hex){
    var r=HexToNumber(hex[1]+hex[2])/255;
    var g=HexToNumber(hex[3]+hex[4])/255;
    var b=HexToNumber(hex[5]+hex[6])/255;
    return vec4(r,g,b,1.0);
 }
function HexToNumberOne(hex){
    if(hex=='a'||hex=='A')return 10;
    if(hex=='b'||hex=='B')return 11;
    if(hex=='c'||hex=='C')return 12;
    if(hex=='d'||hex=='D')return 13;
    if(hex=='e'||hex=='E')return 14;
    if(hex=='f'||hex=='F')return 15;
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
function WebGLModuleEnvironmentConstructor_VerII() {
    var envir={
        cantainerID:"",
        dataSet:{
            pointsArray:[],
            colorsArray:[],
            normalsArray:[]
        },
        canvas:"",
        gl:"",
        shadersProgram:"",
        bufferIds:{},
        LocInShaders:{},
        numVertices:0,
        camera:{},
        viewport:{},
        viewer:{},
        light:{},
        vueInstance:""
       }
    return envir;
}
function setUpCameraAndViewport(envir){
    //camera
    envir["camera"].near= -10;
    envir["camera"].far= 10;
    envir["camera"].radius= 1.5;
    envir["camera"].theta = 0.0;
    envir["camera"].phi= 0.0;
    //viewport
    envir["viewport"].left = -3.0;
    envir["viewport"].right = 3.0;
    envir["viewport"].ytop =3.0;
    envir["viewport"].bottom = -3.0;
}
function setUpViewer(envir){
    //viewer
    envir["viewer"].eye=[];
    envir["camera"].at=vec3(0.0, 0.0, 0.0);
    envir["camera"].up = vec3(0.0, 1.0, 0.0);
}
function setUpLight(envir){
    //viewer

    envir["light"].lightTheta=Math.PI/4;
    envir["light"].lightDelta=1/this.Math.PI;
    let lightTheta=envir["light"].lightTheta;
    //let lightDelta=envir["light"].lightDelta;
    envir["light"].lightPosition = vec4(-1.5*Math.cos(lightTheta),-1.5*Math.sin(lightTheta),1.0, 0.0 );
}
function setUpWebGlEnvironment_VerII(containerID,vueInstance){
         let envir=WebGLModuleEnvironmentConstructor_VerII();
         envir["cantainerID"]=containerID;
         envir["canvas"]=document.querySelector("#"+containerID+" canvas");
         envir["gl"]=envir["canvas"].getContext( "webgl", 
           {
            antialias: true
          });
          envir["vueInstance"]=vueInstance;
          envir["shadersProgram"]=configShaders_VerII(envir);
          setUpCameraAndViewport(envir);
          setUpViewer(envir);
          setUpLight(envir);
          return envir;
}
function addColorCubeToEnvir(envir)
{
    if(envir["dataSet"]["pointsArray"]==undefined){
        envir["dataSet"]["pointsArray"]=[];
    }
    if(envir["dataSet"]["colorsArray"]==undefined){
        envir["dataSet"]["colorsArray"]=[];
    }
    envir["numVertices"]  += 36;
    envir["dataSet"]["pointsArray"]=[];
    envir["dataSet"]["colorsArray"]=[];
    envir["dataSet"]["normalsArray"]=[];
    envir["dataSet"]["texCoordsArray"]=[];
let pointsArray =envir["dataSet"]["pointsArray"];
let colorsArray =envir["dataSet"]["colorsArray"];
let normalsArray =envir["dataSet"]["normalsArray"];
let texCoordsArray =envir["dataSet"]["texCoordsArray"];
let vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
    ];

let vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    ];

    let texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];
    let quad=function (a, b, c, d) {
        let t1 = subtract(vertices[b], vertices[a]);
        let t2 = subtract(vertices[c], vertices[b]);
        let normal = cross(t1, t2);
         normal = vec4(normal[0],normal[1],normal[2],0.0);

        pointsArray.push(vertices[a]);
        colorsArray.push(vertexColors[a]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[0]);

        pointsArray.push(vertices[b]);
        colorsArray.push(vertexColors[a]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[1]);

        pointsArray.push(vertices[c]);
        colorsArray.push(vertexColors[a]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[2]);

        pointsArray.push(vertices[a]);
        colorsArray.push(vertexColors[a]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[0]);

        pointsArray.push(vertices[c]);
        colorsArray.push(vertexColors[a]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[2]);

        pointsArray.push(vertices[d]);
        colorsArray.push(vertexColors[a]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[3]);
   }
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


function addCubeToEnvirWithNormal(envir){
    if(envir["dataSet"]["pointsArray"]==undefined){
        envir["dataSet"]["pointsArray"]=[];
    }
    if(envir["dataSet"]["normalsArray"]==undefined){
        envir["dataSet"]["normalsArray"]=[];
    }
    envir["numVertices"]  += 36;
    envir["dataSet"]["pointsArray"]=[];
    envir["dataSet"]["normalsArray"]=[];
    let pointsArray =envir["dataSet"]["pointsArray"];
    let normalsArray =envir["dataSet"]["normalsArray"];
  
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];
    function quad(a, b, c, d) {

        var t1 = subtract(vertices[b], vertices[a]);
        var t2 = subtract(vertices[c], vertices[b]);
        var normal = cross(t1, t2);
        normal = vec4(normal[0],normal[1],normal[2],0.0);
   
   
        pointsArray.push(vertices[a]);
        normalsArray.push(normal);
        pointsArray.push(vertices[b]);
        normalsArray.push(normal);
        pointsArray.push(vertices[c]);
        normalsArray.push(normal);
        pointsArray.push(vertices[a]);
        normalsArray.push(normal);
        pointsArray.push(vertices[c]);
        normalsArray.push(normal);
        pointsArray.push(vertices[d]);
        normalsArray.push(normal);
   }
   quad( 1, 0, 3, 2 );
   quad( 2, 3, 7, 6 );
   quad( 3, 0, 4, 7 );
   quad( 6, 5, 1, 2 );
   quad( 4, 5, 6, 7 );
   quad( 5, 4, 0, 1 );
}

function addSubDivSphereToEnvir(envir,subDivDepth,normalMethod){

   
    if(envir["dataSet"]["pointsArray"]==undefined){
        envir["dataSet"]["pointsArray"]=[];
    }
    if(envir["dataSet"]["normalsArray"]==undefined){
        envir["dataSet"]["normalsArray"]=[];
    }
    envir["numVertices"]=0;
    envir["dataSet"]["pointsArray"]=[];
    envir["dataSet"]["normalsArray"]=[];
    function _normalize(v){
        //console.log("normalize");
        let a=v[0];  let b=v[1];  let c=v[2];
        let len=Math.sqrt(a*a+b*b+c*c);
        return vec4(a/len,b/len,c/len,v[3])
     }
     function mixHalf(v1,v2){
      //console.log("mix");
       
      return vec4((v1[0]+v2[0])/2,(v1[1]+v2[1])/2,(v1[2]+v2[2])/2,v1[3])
   }
    let pointsArray =envir["dataSet"]["pointsArray"];
    let normalsArray =envir["dataSet"]["normalsArray"];
    subDivDepth=Math.floor(subDivDepth);
    function triangle(a, b, c) {


        a = _normalize(a, true);
        b = _normalize(b, true);
        c = _normalize(c, true);
        // normals are vectors
        if(normalMethod=="defination"){
            normalsArray.push(a[0],a[1], a[2], 0.0);
            normalsArray.push(b[0],b[1], b[2], 0.0);
            normalsArray.push(c[0],c[1], c[2], 0.0);
        }else{
            let v1=subtract(b,a);
            let v2=subtract(c,b);
            let _n=cross(v1,v2);
            var normal = vec4(_n[0],_n[1],_n[2],0.0);
            normalsArray.push(normal);
            normalsArray.push(normal);
            normalsArray.push(normal);
        }
       
   
   
        pointsArray.push(a);
        pointsArray.push(b);
        pointsArray.push(c);
   
        envir["numVertices"]= envir["numVertices"]+3;
   }

   function divideTriangle(a, b, c, count) {
    count=Math.floor(count);
    if ( count > 0 ) {

        let ab = mixHalf( a, b);
        let ac = mixHalf( a, c);
        let bc = mixHalf( b, c);






        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        //console.log(count);
        triangle( a, b, c );
    }
   }
    function tetrahedronDivToShpere(a, b, c, d, n) {
        divideTriangle(a, c, b, n);
        divideTriangle(c, d, b, n);
        divideTriangle(a, b, d, n);
        divideTriangle(a, d, c, n);
    }
    let va = vec4(0.0, 0.0, -1.0,1);
    let vb = vec4(0.0, 0.942809, 0.333333, 1);
    let vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    let vd = vec4(0.816497, -0.471405, 0.333333,1);
    tetrahedronDivToShpere(va, vb, vc, vd,subDivDepth);
}
function addSombreroHatToEnvir(envir,nDense,yScale,xzScale){
    //produce Height field data
    var heightField = [];
    let idToPos=(i)=>{return (2*i/nDense-1.0);}
    for( var i = 0; i < nDense;i++ ) {
        heightField.push( [] );
        var x = idToPos(i);
    
        for( var j = 0; j < nDense;j++ ) {
            var y = idToPos(j);
            var r = xzScale*Math.sqrt(x*x+y*y);
            heightField[i][j] =Math.abs(r-0)>0.0001? (yScale*Math.sin(Math.PI*r) / r ): 1.0;
        }
    }
    let heightFieldPosAt=function(i,j){
        return vec4(idToPos(i), heightField[i][j],idToPos(j), 1.0);
    };
     //add position data to pointsArray and colorsArray
     envir["dataSet"]["pointsArray"]=[];
    let pointsArray =envir["dataSet"]["pointsArray"];

    for(var i=0; i<nDense-1; i++) {
        for(var j=0; j<nDense-1;j++) {
            pointsArray.push( heightFieldPosAt(i,j));
            pointsArray.push( heightFieldPosAt(i,j+1));
       
          
            pointsArray.push( heightFieldPosAt(i+1,j+1));
            pointsArray.push( heightFieldPosAt(i+1,j));
            envir["numVertices"]+=4;
    }
}
  
 }
function SphericalCoordinateToXYZ(radius,Azimuth,Elevation){
    let x=  radius*Math.sin(Elevation)*Math.cos(Azimuth);
    let y= radius*Math.sin(Elevation)*Math.sin(Azimuth);
    let z=    radius*Math.cos(Elevation);
    return [x,y,z];
}

function multColor(c1,c2){
  return vec4(c1[0]*c2[0],c1[1]*c2[1],c1[2]*c2[2],1);

}


function configureTexture( image,envir,isDomElement,isFlatten,texSize) {
    let gl=envir["gl"];
   
    let texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
     if(isDomElement){
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,gl.RGB, gl.UNSIGNED_BYTE, image );
     }else {
        if(!isFlatten){
            let width=image.length;
            let length=image[0].length;
            let image2=flatImage(image,width,length);
           gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, length, 0,
               gl.RGBA, gl.UNSIGNED_BYTE, image2);
        }else{
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
        }
     }
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    return texture;
}
function generateCheckerBoard(texSize,unit_num){
    let image1= new Array(texSize);
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    let unit_len=texSize/unit_num;
    for (let i =0; i<texSize; i++){
        for (let j=0; j<texSize; j++){
            let c=Math.floor(i/unit_len)%2;
            c=(c+Math.floor(j/unit_len))%2;
            image1[i][j] = [c, c, c, c];
        }
    } 
  return image1;
}
function generateStripe(texSize,unit_num,direction){
    let image1= new Array(texSize);
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            let patch = Math.floor(i/(texSize/unit_num));
            if(direction=="Y"){
             patch = Math.floor(j/(texSize/unit_num));
            }
            if(patch%2)c=1;
            else c = 0;
            image1[i][j] = [c,c,c,1];
      
        }
    }
  return image1;
}
function generatePureColor(texSize,Color){
    let image1= new Array(texSize);
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            image1[i][j] = Color;
        }
    }
  return image1;
}

function generateSinusoid(texSize){
    let image1= new Array(texSize);
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            let c=0.5+0.5*Math.sin(0.1*i*j);
            image1[i][j] = [c,c,c,1];
        }
    }
  return image1;
}

function generateCheckerBoard_v2(texSize,numChecks){
    let image1 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255;
            else c = 0;
            //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
            image1[4*i*texSize+4*j] = c;
            image1[4*i*texSize+4*j+1] = c ;
            image1[4*i*texSize+4*j+2] =c ;
            image1[4*i*texSize+4*j+3] = 1;
        }
    }
   return image1;
}
function generateSinusoid_V2(texSize){
    let image2 = new Uint8Array(4*texSize*texSize);

    // Create a checkerboard pattern
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            let c=127+127*Math.cos(0.1*i*j);
            image2[4*i*texSize+4*j] = c;
            image2[4*i*texSize+4*j+1] =c;
            image2[4*i*texSize+4*j+2] = c;
            image2[4*i*texSize+4*j+3] = 255;
           }
    }
    return image2;
}
function flatImage(image1,width,length){
    var image2 = new Uint8Array(4*length*width);
    for ( var i = 0; i <width; i++ )
    for ( var j = 0; j <length; j++ )
       for(var k =0; k<4; k++)
            image2[4*length*i+4*j+k] = 255*image1[i][j][k];
    return image2;
}


