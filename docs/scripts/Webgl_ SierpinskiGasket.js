"use strict";
var WebGLModuleController={};
var WebGLModuleControllerProto={
   cantainerID:"",
   dataSet:{},
   cnv:"",
   gl:"",
   shadersProgram:"",
   bufferId:"",
   inputVar:{},
   viewPortUIControler:"",
    setup: function(_cantainerID){
    this.cantainerID="#"+_cantainerID;
    this.cnv = document.querySelector( this.cantainerID+ " .gl-canvas" );
    this.gl = this.cnv.getContext( "webgl" );
    this.configureWebGL();
    this.setupUI();
    },
    changeSetting:function(WebGLPackage){
    }, 
    configureWebGL:function (){
    this.gl.viewport( 0, 0, this.cnv.width,  this.cnv.height);
    this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },
    setupUI :function(){
    this.viewPortUIControler=Object.assign({},ButtonToHideDivProto);
    this.viewPortUIControler.setup(this.cantainerID+" .btnToggleForm_viewport",this.cantainerID+" .shaderInput");
    document.getElementById("pN").addEventListener("change",this.mainDraw);
    document.querySelector(this.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",this.mainDraw);
     },   
     mainDraw:function(){
        var containerID=this.parentElement.parentElement.parentElement.id;
        //mainDraw is callback ,this. refer to EventListener trigger i.e ui object
        WebGLModuleController[containerID].shadersProgram=configShaders(WebGLModuleController[containerID].gl, WebGLModuleController[containerID].cantainerID);
        //console.log(document.getElementById("pN").value);
        var np=Number(document.getElementById("pN").value);
        WebGLModuleController[containerID].inputVar.numsOfPoinnts=np;
        document.getElementById("tPn").innerText=" "+np;
        if(np<=0){
            WebGLModuleController[containerID].clear( gl.COLOR_BUFFER_BIT );
            return;
        };
        WebGLModuleController[containerID].produceGeometryData();
        WebGLModuleController[containerID].sendDataToGPU();
        WebGLModuleController[containerID].associateDataInShaders();
        WebGLModuleController[containerID].mainRender();
    },
    sendDataToGPU:function(){
        this.bufferId =  this.gl.createBuffer();
        this.gl.bindBuffer(  this.gl.ARRAY_BUFFER,  this.bufferId );
        this.gl.bufferData(  this.gl.ARRAY_BUFFER, flattenArrayOfVectors( this.dataSet.Points),  this.gl.STATIC_DRAW );
    },
    associateDataInShaders:function(){
        var vertexPositions = this.gl.getAttribLocation(  this.shadersProgram, "vertexPosition" );
        this.gl.vertexAttribPointer( vertexPositions, 3,  this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vertexPositions );
    },
    mainRender:function(){
        this.gl.clear(  this.gl.COLOR_BUFFER_BIT );
        this.gl.drawArrays(this.gl.POINTS, 0, this.inputVar.numsOfPoinnts);
    },
    produceGeometryData:function(){
        var numPoints = this.inputVar.numsOfPoinnts;
        var vertices = [
        vec3(-1.0, -1.0,0.0),
        vec3(0.0, 1.0,0.0),
        vec3(1.0, -1.0,0.0)
        ];
         
        /* 
        
         var vertices = [
        vec2(-1.0, -1.0),
        vec2(0.0, 1.0),
        vec2(1.0, -1.0)
        ];
        */
    
        var u = mix(vertices[0], vertices[1], 0.5);
        var v = mix(vertices[0], vertices[2], 0.5);
        var p = mix(u, v, 0.5);
        var points = [ p ];
        for (var i = 0; points.length < numPoints; ++i) {
        var j = Math.floor(Math.random() * 3);
        p = mix(points[i], vertices[j], 0.5);
        points.push(p);
        }
        this.dataSet.Points=points;
    }
}


window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    WebGLModuleController["WebGLModule_1"]=Object.create(WebGLModuleControllerProto);
    WebGLModuleController["WebGLModule_1"].setup("WebGLModule_1");
    //settingCanvas();
    
}



function producePointsV2(n){
    numPoints = n;
   var vertices = [
   vec3(-1.0, -1.0, 0.0),
   vec3(0.0, 1.0, 0.0),
   vec3(1.0, -1.0, 0.0)
   ];
   var u = mix(vertices[0], vertices[1], 0.5);
   var v = mix(vertices[0], vertices[2], 0.5);
   var p = mix(u, v, 0.5);
   var points = [ p ];
   for (var i = 0; points.length < numPoints; ++i) {
   var j = Math.floor(Math.random() * 3);
   p = mix(points[i], vertices[j], 0.5);
   points.push(p);
   }
   return points;
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
