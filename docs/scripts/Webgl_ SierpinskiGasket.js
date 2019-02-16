"use strict";
var Points;
var ctx2D;
var gl;
var cnv;
var shadersProgram;
var bufferId;
var numPoints;
var viewPortUIControler=[];

var WebGLModuleController={
   cantainerID:undefined,
   data:undefined,
   cnv:undefined,
   gl:undefined,
   shadersProgram:undefined,
   bufferId:undefined,
   inputVar:{},
   viewPortUIControler:undefined,
   setup:function(_cantainerID){
    cantainerID=cantainerID;
   }
}
window.onload=function init(){
    cnv = document.getElementById( "gl-canvas_1" );
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    document.getElementById("pN").addEventListener("change",drawSG);
    gl = cnv.getContext( "webgl" );
    //settingCanvas();
    setupUI();
    configureWebGL();
    
}
function configureWebGL(){
    gl.viewport( 0, 0, cnv.width, cnv.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
function setupUI(){
    viewPortUIControler.push(ButtonToHideDiv);
    viewPortUIControler[0].setup("#WebGLModule_1"+" .btnToggleForm_viewport","#WebGLModule_1"+" .shaderInput");
    document.querySelector("#WebGLModule_1"+" .btnUpdateShader_viewport").addEventListener("click",function(){
        load_Shaders();
        drawSG();
    });
}
function load_Shaders(){
    updateTextArea("#WebGLModule_1"+" .vertexShader");updateTextArea("#WebGLModule_1"+" .fragmentShader");
    shadersProgram = loadShaders( gl, "#WebGLModule_1"+" .vertexShader","#WebGLModule_1"+" .fragmentShader" );
    gl.useProgram( shadersProgram ); 
}
function drawSG(){
    load_Shaders(true);
    //console.log(document.getElementById("pN").value);
    var np=Number(document.getElementById("pN").value);
    document.getElementById("tPn").innerText=" "+np;
    if(np<=0){
        gl.clear( gl.COLOR_BUFFER_BIT );
        return;
    }
    Points= producePoints(np);
    sendDataToGPU(Points);
    associateDataInShaders();
    mainRender();
    
}
function sendDataToGPU(v){
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flattenArrayOfVectors(v), gl.STATIC_DRAW );
    
}
function associateDataInShaders(){
    var vertexPositions = gl.getAttribLocation( shadersProgram, "vertexPosition" );
    gl.vertexAttribPointer( vertexPositions, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPositions );
}
function producePoints(n){
     numPoints = n;
   
    
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
    return points;
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
function mainRender(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, numPoints );
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
