"use strict";
var Vue_1;
var WebGLEnvir;
function configWebGL(envir){
    let gl=envir["gl"];
    let canvas=envir["canvas"];
    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.clear( gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);
}
function bufferDataToGPU(envir,isColorOnly){
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
    

        if(!isColorOnly){
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

    envir["LocInShaders"]["modelViewMatrixLoc"]  = gl.getUniformLocation( program, "modelViewMatrix" );
    envir["LocInShaders"]["projectionMatrixLoc"]  = gl.getUniformLocation( program, "projectionMatrix" );
    envir["LocInShaders"]["shadowSwitchLoc"]  = gl.getUniformLocation( program, "shadowSwitch" );
}
function _updateShader(){
    WebGLEnvir["shadersProgram"]=configShaders_VerII(WebGLEnvir);
    bufferDataToGPU(WebGLEnvir,false);
}
function addUniformColorToColorArray(envir,vColor){

    envir["dataSet"]["colorsArray"]=[];
    let colorsArray =envir["dataSet"]["colorsArray"];
    let n=   envir["numVertices"];
    for(let i=0;i<n;i++)colorsArray.push(vColor);
}
function changeGeo(val) {
    console.log("In watch : display_item = "+val);
    WebGLEnvir["numVertices"]=0;
    if(val=='cube'){
        addColorCubeToEnvir(WebGLEnvir);
        bufferDataToGPU(WebGLEnvir,false);
    }else{
        addSombreroHatToEnvir(WebGLEnvir,40,0.4,3);
        bufferDataToGPU(WebGLEnvir,false);
    }
}
window.onload=function init(){
    Vue_1= new Vue({
        el:"#mainDiv_1",
        data:{
            geoType:"cube",
            xRot:0,
            yRot:0,
            zRot:0,
            normalMethod:"defination",
            subDivDepth:3,
            m_diffuseColorHex:"#AAAAAA",
            m_specularColorHex:"#FFFFFF",
            m_ambientColorHex:"#DDDDDD",
            m_shininess:3,
            l_diffuseColorHex:"#FFFFFF",
            l_specularColorHex:"#FFFFFF",
            l_ambientColorHex:"#FFFFFF",
            isMovingLight:true,
            //
            isShowShaderEditor:false,
            near:0.4,
            far:4.2,
            radius:1.6,
            phi:105,
            theta:55,
            v_width:2,
            v_height :2,
            FOV:45,
            aspect:1,
            display_item:'cube',
            viewingMode:"Parallel",
            isDisplayShadow:true,
            vertexShader:document.querySelector(".vertexShader").value,
            fragmentShader:document.querySelector(".fragmentShader").value,

        },
        methods:{
            updateShader:function(){
                _updateShader();
                console.log("updateShader!!!");
            }
        },
        watch:{
            geoType:changeGeo
    }
}
    );
   WebGLEnvir=setUpWebGlEnvironment_VerII("mainDiv_1",Vue_1);
   configWebGL(WebGLEnvir);
   addColorCubeToEnvir(WebGLEnvir);
   bufferDataToGPU(WebGLEnvir,false);
   //set light
   WebGLEnvir["lightData"].push(
        {
                pos:vec3(0.0, 2.0, 0.0),
                color:vec3(1.0, 1.0,1.0)
        }
   );
   let lightTheta=0.0;
//shadowProjectMat
   let shadowProjectMat=mat4();
   shadowProjectMat[3][3] = 0;
   shadowProjectMat[3][1] = -1/(  WebGLEnvir["lightData"][0]["pos"][1]+1);
   //generate render function
let mainRender = function() {
    //get envir
    let numVertices=WebGLEnvir["numVertices"];
    if(numVertices==0)return;
    let gl=WebGLEnvir["gl"];
 
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
    let shadowSwitchLoc=WebGLEnvir["LocInShaders"]["shadowSwitchLoc"];
    //produce modelViewMatrix & projectionMatrix
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
 
    //switch display element
    let display_item=Vue_1.$data["display_item"];
    //Project Shadow
    let onShadow=Vue_1.$data["isDisplayShadow"];
     // rotate light source
     lightTheta=(lightTheta+0.1)%(2*Math.PI);
     WebGLEnvir["lightData"][0]["pos"][0] = Math.sin(lightTheta);
     WebGLEnvir["lightData"][0]["pos"][2] = Math.cos(lightTheta);
     let lightPos= WebGLEnvir["lightData"][0]["pos"];

         if(display_item=='cube'){
         /*   addColorCubeToEnvir(WebGLEnvir);
            bufferDataToGPU(WebGLEnvir,false); */
            gl.uniform1f(shadowSwitchLoc,1.0);
             gl.drawArrays( gl.TRIANGLES, 0, numVertices );
             if(onShadow){
                   // model-view matrix for shadow 
                   modelViewMatrix = mult(modelViewMatrix, translateM(lightPos[0], lightPos[1], lightPos[2]));
                   modelViewMatrix = mult(modelViewMatrix, shadowProjectMat);
                   modelViewMatrix = mult(modelViewMatrix, translateM(-lightPos[0], -lightPos[1], -lightPos[2]));
                   gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        /*     addUniformColorToColorArray(WebGLEnvir,vec4(0.0,0.0,0.0,1.0));
            bufferDataToGPU(WebGLEnvir,true); */
            gl.uniform1f(shadowSwitchLoc,0.0);
            gl.drawArrays( gl.TRIANGLES, 0, numVertices );
             }
        }
         else {
            gl.uniform1f(shadowSwitchLoc,1.0);
            addUniformColorToColorArray(WebGLEnvir,vec4(1.0,0.0,0.0,1.0));
            bufferDataToGPU(WebGLEnvir,true);
            for(var i=0; i<numVertices; i+=4) {
               
                gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
              
            }
            addUniformColorToColorArray(WebGLEnvir,vec4(0.0,0.0,0.0,1.0));
            bufferDataToGPU(WebGLEnvir,true);
            for(var i=0; i<numVertices; i+=4) {
              
                gl.drawArrays( gl.LINE_LOOP, i, 4 );
            }
         }

/*  */
}
setInterval(
    function(){
        requestAnimationFrame(mainRender);
    },
    1000/10
    );
}







