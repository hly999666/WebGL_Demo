"use strict";
var Points;
var ctx2D;
var gl;
var cnv;
var pointColor = vec4(1.0, 0.0, 0.0, 1.0);
var shadersProgram;
var bufferId;
var numPoints;
window.onload=function init(){
    cnv = document.getElementById( "gl-canvas" );
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //ctx2D=cnv.getContext("2d");
    document.getElementById("pN").addEventListener("change",drawSG);
    gl = cnv.getContext( "webgl" );
    //settingCanvas();
   
    configureWebGL();
    load_Shaders();
}
function configureWebGL(){
    gl.viewport( 0, 0, cnv.width, cnv.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
function load_Shaders(){
    shadersProgram = loadShaders( gl, "v21","f21" );
    gl.useProgram( shadersProgram ); 
}
function drawSG(){
    //console.log(document.getElementById("pN").value);
    var np=Number(document.getElementById("pN").value);
    document.getElementById("tPn").innerText=" "+np;
    if(np<=0){
        gl.clear( gl.COLOR_BUFFER_BIT );
        return;
    }
    Points= producePoints(np);
    loadData(Points);
    associateDataInShaders();
    mainRender();
    
}
function loadData(v){
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flattenArrayOfVectors(v), gl.STATIC_DRAW );
}
function associateDataInShaders(v){
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