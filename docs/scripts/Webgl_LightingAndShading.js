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
function bufferDataToGPU(envir){
    let gl=envir["gl"];
    let program=envir["shadersProgram"];
    envir["bufferIds"]["nBufferId"]  = gl.createBuffer();
    envir["bufferIds"]["vBufferId"]  = gl.createBuffer();
    let nBufferId= envir["bufferIds"]["nBufferId"] ;
    let vBufferId= envir["bufferIds"]["vBufferId"] ;
    let normalsArray=envir["dataSet"]["normalsArray"] ;
    let pointsArray=envir["dataSet"]["pointsArray"] ;
   
    envir["LocInShaders"]["vNormal"]= gl.getAttribLocation( program, "vNormal" );
    let vNormalLoc = envir["LocInShaders"]["vNormal"];
    envir["LocInShaders"]["vPosition"]= gl.getAttribLocation( program, "vPosition" );
    let vPositionLoc = envir["LocInShaders"]["vPosition"];

   //send normal date 
    gl.bindBuffer( gl.ARRAY_BUFFER, nBufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormalLoc);
    //send position date 
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPositionLoc);
  
    envir["LocInShaders"]["modelViewMatrixLoc"]  = gl.getUniformLocation( program, "modelViewMatrix" );
    envir["LocInShaders"]["projectionMatrixLoc"]  = gl.getUniformLocation( program, "projectionMatrix" );
    envir["LocInShaders"]["ambientProductLoc"]  = gl.getUniformLocation( program, "ambientProduct" );
    envir["LocInShaders"]["diffuseProductLoc"]  = gl.getUniformLocation( program, "diffuseProduct" );
    envir["LocInShaders"]["specularProductLoc"]  = gl.getUniformLocation( program, "specularProduct" );
    envir["LocInShaders"]["lightPositionLoc"]  = gl.getUniformLocation( program, "lightPosition" );
    envir["LocInShaders"]["shininessLoc"]  = gl.getUniformLocation( program, "shininess" );

    envir["LocInShaders"]["eyePositionLoc"]  = gl.getUniformLocation( program, "eyePosition" );
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
            subDivDepth:5,
            m_diffuseColorHex:"#999999",
            m_specularColorHex:"#AAAAAA",
            m_ambientColorHex:"#DDDDDD",
            m_shininess:5,
            l_diffuseColorHex:"#DDDDDD",
            l_specularColorHex:"#CCCCCC",
            l_ambientColorHex:"#333333",
            isMovingLight:true,
            isShowShaderEditor:false,
            ShaderEditorBtnStr:"Edit Shader",
            //
           
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
            },
            clickShaderEditorBtn:function(){
                let vm=this;
                vm["isShowShaderEditor"]=!vm["isShowShaderEditor"];
                if(vm["isShowShaderEditor"]){
                    vm["ShaderEditorBtnStr"]="Close Editor";
                }else{
                    vm["ShaderEditorBtnStr"]="Edit Shader";
                }
            }
        },
        watch:{
            geoType:changeGeo
    }
}
    );

   //camera and viewport parameter
   let near = -10;
   let far = 10;
   let radius = 1.5;
   let theta  = 0.0;
   let phi    = 0.0;
   let dr = 5.0 * Math.PI/180.0;
   
   let left = -3.0;
   let right = 3.0;
   let ytop =3.0;
   let bottom = -3.0;
   //viewer parameter
   let eye;
   let at = vec3(0.0, 0.0, 0.0);
   let up = vec3(0.0, 1.0, 0.0);
   //light parameter
   let lightTheta=0.0;
   //set up envir
    WebGLEnvir=setUpWebGlEnvironment_VerII("mainDiv_1",Vue_1);
   configWebGL(WebGLEnvir);

   //addCubeToEnvirWithNormal(WebGLEnvir);
   addSubDivSphereToEnvir(WebGLEnvir,5,Vue_1.$data["normalMethod"])
   bufferDataToGPU(WebGLEnvir);



 

   //generate render function
let mainRender = function() {
    //get envir
    let numVertices=WebGLEnvir["numVertices"];
    if(numVertices==0)return;
    let gl=WebGLEnvir["gl"];
   let envir=WebGLEnvir;
    let lightPosition = vec4(-1.0, -1.0,1.0, 0.0 );
    let lightAmbient = convertHexColorToVec4(Vue_1.$data["l_ambientColorHex"]);
    let lightDiffuse = convertHexColorToVec4(Vue_1.$data["l_diffuseColorHex"]);
    let lightSpecular = convertHexColorToVec4(Vue_1.$data["l_specularColorHex"]);

    let materialAmbient =convertHexColorToVec4(Vue_1.$data["m_ambientColorHex"]);
    let materialDiffuse =convertHexColorToVec4(Vue_1.$data["m_diffuseColorHex"]);
    let materialSpecular =convertHexColorToVec4(Vue_1.$data["m_specularColorHex"]);
    let materialShininess =Number(Vue_1.$data["m_shininess"]);

    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

    let xRot = Number(Vue_1.$data["xRot"]);
    let yRot = Number(Vue_1.$data["yRot"]);
    let zRot = Number(Vue_1.$data["zRot"]);
    let modelMat=mult(rotateZ_M(zRot),mult(rotateY_M(yRot),rotateX_M(xRot)));
    modelMat=mult(scaleM(2,2,2),modelMat);
    gl.uniform4fv( envir["LocInShaders"]["ambientProductLoc"],flatten(ambientProduct) );
     gl.uniform4fv( envir["LocInShaders"]["diffuseProductLoc"],flatten(diffuseProduct) );
     gl.uniform4fv( envir["LocInShaders"]["specularProductLoc"],flatten(specularProduct) );
     gl.uniform4fv( envir["LocInShaders"]["lightPositionLoc"],flatten(lightPosition) );
     gl.uniform1f(envir["LocInShaders"]["shininessLoc"],materialShininess );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    gl.uniform3fv( envir["LocInShaders"]["eyePositionLoc"], flatten(eye));

     let modelViewMatrix = mult(lookAt(eye, at , up),modelMat);
     let projectionMatrix = ortho(left, right, bottom, ytop, near, far);

     gl.uniformMatrix4fv( envir["LocInShaders"]["modelViewMatrixLoc"], false, flatten(modelViewMatrix) );
     gl.uniformMatrix4fv( envir["LocInShaders"]["projectionMatrixLoc"], false, flatten(projectionMatrix) );
     gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
setInterval(
    function(){
        requestAnimationFrame(mainRender);
    },
    1000/10
    );
}







