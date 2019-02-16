"use strict";
var Points;
var ctx2D;
var gl;
var cnv;
var pointColor = vec4(1.0, 0.0, 0.0, 1.0);
var shadersProgram;
var bufferId;
var numPoints;
var viewPortUIControler=[];
window.onload=function init(){
    cnv = document.getElementById( "gl-canvas_1" );
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //ctx2D=cnv.getContext("2d");
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
    viewPortUIControler[0].setup("btnToggleForm_viewport_1","shaderInput_1");
    document.getElementById("btnUpdateShader_viewport_1").addEventListener("click",function(){load_Shaders(true);});
}
function load_Shaders(isUpdate){
    if(isUpdate){updateTextArea("vertexShader_1");updateTextArea("fragmentShader_1");}
    shadersProgram = loadShaders( gl, "vertexShader_1","fragmentShader_1" );
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
function loadShaders(gl, vertexShaderId, fragmentShaderId ){
    var vertShdr;
    var fragShdr;
    var vertElem =document.getElementById(vertexShaderId).innerHTML;
    vertShdr = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vertShdr, vertElem);
    gl.compileShader( vertShdr );
    var fragElem =document.getElementById(fragmentShaderId).innerHTML;
    fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fragShdr, fragElem);
    gl.compileShader( fragShdr );
    
    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    return program;
}
