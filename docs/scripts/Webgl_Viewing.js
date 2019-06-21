"use strict";
var Vue_1;
var WebGLEnvir;
function setViewPort(envir){
    let gl=envir["gl"];
    let canvas=envir["canvas"];
    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.clear( gl.COLOR_BUFFER_BIT);
}
function bufferDataToGPU(envir){
    let gl=envir["gl"];
    let program=envir["shadersProgram"];
    envir["bufferIds"]["cBufferId"]  = gl.createBuffer();
    envir["bufferIds"]["vBufferId"]  = gl.createBuffer();
    let cBufferId= envir["bufferIds"]["cBufferId"] ;
    let vBufferId= envir["bufferIds"]["vBufferId"] ;
    let colorsArray=envir["dataSet"]["colorsArray"] ;
    let pointsArray=envir["dataSet"]["pointsArray"] ;
    envir["LocInShaders"]["vColor"]= gl.getAttribLocation( program, "vColor" );
    let vColor = envir["LocInShaders"]["vColor"];
    envir["LocInShaders"]["vPosition"]= gl.getAttribLocation( program, "vPosition" );
    let vPosition = envir["LocInShaders"]["vPosition"];

    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    envir["LocInShaders"]["modelViewMatrixLoc"]  = gl.getUniformLocation( program, "modelViewMatrix" );
    envir["LocInShaders"]["projectionMatrixLoc"]  = gl.getUniformLocation( program, "projectionMatrix" );

}
function _updateShader(){
    WebGLEnvir["shadersProgram"]=configShaders_VerII(WebGLEnvir);
    bufferDataToGPU(WebGLEnvir);
}
window.onload=function init(){
    Vue_1= new Vue({
        el:"#mainDiv_1",
        data:{
            isShowShaderEditor:false,
            near:1,
            far:1,
            radius:1,
            phi:0,
            theta:90,
            v_width:2,
            v_height :2,
            FOV:45,
            aspect:1,
            display_item:'cube',
            viewingMode:"Parallel",
            vertexShader:document.querySelector(".vertexShader").value,
            fragmentShader:document.querySelector(".fragmentShader").value
        },
        methods:{
            updateShader:function(){
                _updateShader();
                console.log("updateShader!!!");
            }
        },
        watch:{
            display_item:function(val) {
                console.log("In watch : display_item = "+val);
                WebGLEnvir["numVertices"]=0;
                if(val=='cube'){
                    addColorCubeToEnvir(WebGLEnvir);
                    bufferDataToGPU(WebGLEnvir);
                }else{

                }
            }
        }
    });
   WebGLEnvir=setUpWebGlEnvironment_VerII("mainDiv_1",Vue_1);
   setViewPort(WebGLEnvir);
   addColorCubeToEnvir(WebGLEnvir);
   bufferDataToGPU(WebGLEnvir);
   //generate render function


let mainRender = function() {
    let gl=WebGLEnvir["gl"];
    let numVertices=WebGLEnvir["numVertices"];
    let phi=Number(Vue_1.$data["phi"])*(Math.PI/180);
    let theta=Number(Vue_1.$data["theta"])*(Math.PI/180);
    let radius=Number(Vue_1.$data["radius"]);
    let  at = vec3(0.0, 0.0, 0.0);
    let  up = vec3(0.0, 1.0, 0.0);
    let left=-Number(Vue_1.$data["v_width"])/2;
    let right=Number(Vue_1.$data["v_width"])/2;
    let bottom=-Number(Vue_1.$data["v_height"])/2;
    let top=Number(Vue_1.$data["v_height"])/2;
    let near=Number(Vue_1.$data["near"]);
    let far=near+Number(Vue_1.$data["far"]);
    let fovy=Number(Vue_1.$data["FOV"]);
    let aspect=Number(Vue_1.$data["aspect"]);
    let projectionMode=Vue_1.$data["viewingMode"];
    let modelViewMatrixLoc=WebGLEnvir["LocInShaders"]["modelViewMatrixLoc"];
    let projectionMatrixLoc=WebGLEnvir["LocInShaders"]["projectionMatrixLoc"];
  
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let eye = SphericalCoordinateToXYZ(radius,phi,theta);
/*     console.log(eye); */
    let modelViewMatrix = lookAt(eye, at , up);
    let projectionMatrix = mat4();
    if(projectionMode=="Parallel"){
        projectionMatrix=ortho(left, right, bottom, top, near, far);
    }else{
        projectionMatrix=perspective( fovy, aspect, near, far );
    }
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    if(numVertices!=0)gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
setInterval(
    function(){
        requestAnimationFrame(mainRender);
    },
    1000/10
    );
}







