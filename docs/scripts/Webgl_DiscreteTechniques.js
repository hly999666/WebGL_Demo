"use strict";
 
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
    envir["bufferIds"]["cBufferId"]  = gl.createBuffer();
    envir["bufferIds"]["tCBufferId"]  = gl.createBuffer();

    let nBufferId= envir["bufferIds"]["nBufferId"] ;
    let vBufferId= envir["bufferIds"]["vBufferId"] ;
    let cBufferId= envir["bufferIds"]["cBufferId"] ;
    let tCBufferId=  envir["bufferIds"]["tCBufferId"];
    let normalsArray=envir["dataSet"]["normalsArray"] ;
    let pointsArray=envir["dataSet"]["pointsArray"] ;
    let colorsArray=envir["dataSet"]["colorsArray"] ;
    let texCoordsArray =envir["dataSet"]["texCoordsArray"];

    envir["LocInShaders"]["vNormal"]= gl.getAttribLocation( program, "vNormal" );
    let vNormalLoc = envir["LocInShaders"]["vNormal"];
    envir["LocInShaders"]["vPosition"]= gl.getAttribLocation( program, "vPosition" );
    let vPositionLoc = envir["LocInShaders"]["vPosition"];
   envir["LocInShaders"]["vColor"]= gl.getAttribLocation( program, "vColor" );
    let vColorLoc = envir["LocInShaders"]["vColor"];
    envir["LocInShaders"]["vTexCoord"]= gl.getAttribLocation( program, "vTexCoord" );
    let vTexCoordLoc = envir["LocInShaders"]["vTexCoord"];

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
  //send color date
   gl.bindBuffer(gl.ARRAY_BUFFER, tCBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoordLoc); 

    //send TexCoord date
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColorLoc); 

    envir["LocInShaders"]["modelViewMatrixLoc"]  = gl.getUniformLocation( program, "modelViewMatrix" );
    envir["LocInShaders"]["projectionMatrixLoc"]  = gl.getUniformLocation( program, "projectionMatrix" );
    envir["LocInShaders"]["ambientProductLoc"]  = gl.getUniformLocation( program, "ambientProduct" );
    envir["LocInShaders"]["diffuseProductLoc"]  = gl.getUniformLocation( program, "diffuseProduct" );
    envir["LocInShaders"]["specularProductLoc"]  = gl.getUniformLocation( program, "specularProduct" );
    envir["LocInShaders"]["lightPositionLoc"]  = gl.getUniformLocation( program, "lightPosition" );
    envir["LocInShaders"]["shininessLoc"]  = gl.getUniformLocation( program, "shininess" );

 
    //envir["LocInShaders"]["normalMatrixLoc"]  = gl.getUniformLocation( program, "normalMatrix" );

    envir["LocInShaders"]["modelMatrixLoc"]  = gl.getUniformLocation( program, "modelMatrix" );
    envir["LocInShaders"]["viewMatrixLoc"]  = gl.getUniformLocation( program, "viewMatrix" );
    envir["LocInShaders"]["normalMatLoc"]  = gl.getUniformLocation( program, "normalMat" );
    envir["LocInShaders"]["eyePositionLoc"]=gl.getUniformLocation( program, "eyePosition" );
    //send image
    //let image = document.getElementById("texImage_1");

    let texSize=128;
    let image_1=generateSinusoid(texSize);
    let image_2=generateCheckerBoard(texSize,8);

 
    let texture1=configureTexture(image_1,envir,false);
    let texture2 =configureTexture(image_2,envir,false);
   
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
 
}
function bufferDataToGPU_1(envir){
    bufferDataToGPU(envir);
    let gl=envir["gl"];
    let program=envir["shadersProgram"];
    let cubeMap=configureSimpleCubeMap(envir);
    gl.activeTexture( gl.TEXTURE2 );
    gl.bindTexture( gl.TEXTURE_CUBE_MAP, cubeMap );
    gl.uniform1i(gl.getUniformLocation( program, "cubeMap"), 2);
}
function _updateShader(envir){
    envir["shadersProgram"]=configShaders_VerII(envir);
    bufferDataToGPU(envir);
}
function addUniformColorToColorArray(envir,vColor){

    envir["dataSet"]["colorsArray"]=[];
    let colorsArray =envir["dataSet"]["colorsArray"];
    let n=   envir["numVertices"];
    for(let i=0;i<n;i++)colorsArray.push(vColor);
}
function changeGeo(val,envir) {
    console.log("In watch : display_item = "+val);
    envir["numVertices"]=0;
    if(val=='cube'){
        addColorCubeToEnvir(envir);
        bufferDataToGPU(envir);
    }else{
        let Vue_1=envir["vueInstance"];
        addSubDivSphereToEnvir(envir,Vue_1.$data["subDivDepth"],Vue_1.$data["normalMethod"]);
        bufferDataToGPU(envir);
    }
}
function buildMainRender(envir,Vue_1){

    let mainRender= function() {
        //get envir
        let numVertices=envir["numVertices"];
         //console.log("numVertices = "+numVertices);
        if(numVertices==0)return;
        let gl=envir["gl"];
       //let envir=WebGLEnvir_1;
      
      let isMovingLight=Vue_1.$data["isMovingLight"];
        //console.log("isMovingLight = "+isMovingLight);
        if(isMovingLight=="true"||isMovingLight==true){
           
            envir["light"].lightTheta+= envir["light"].lightDelta;
            let lightTheta=envir["light"].lightTheta;
            envir["light"].lightPosition = vec4(1.5*Math.cos(lightTheta),1.5*Math.sin(lightTheta),1.0, 0.0 );
        }
        
        let lightAmbient = convertHexColorToVec4(Vue_1.$data["l_ambientColorHex"]);
        let lightDiffuse = convertHexColorToVec4(Vue_1.$data["l_diffuseColorHex"]);
        let lightSpecular = convertHexColorToVec4(Vue_1.$data["l_specularColorHex"]);
    
        let materialAmbient =convertHexColorToVec4(Vue_1.$data["m_ambientColorHex"]);
        let materialDiffuse =convertHexColorToVec4(Vue_1.$data["m_diffuseColorHex"]);
        let materialSpecular =convertHexColorToVec4(Vue_1.$data["m_specularColorHex"]);
        let materialShininess =Number(Vue_1.$data["m_shininess"]); 
     
    
    /* var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
    var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    var materialShininess = 20.0; */
    
    
        let ambientProduct = mult(lightAmbient, materialAmbient);
        let diffuseProduct = mult(lightDiffuse, materialDiffuse);
        let specularProduct = mult(lightSpecular, materialSpecular);
    
        let xRot = Number(Vue_1.$data["xRot"]);
        let yRot = Number(Vue_1.$data["yRot"]);
        let zRot = Number(Vue_1.$data["zRot"]);
        let modelMat=mult(rotateZ_M(zRot),mult(rotateY_M(yRot),rotateX_M(xRot)));
        modelMat=mult(scaleM(2,2,2),modelMat);
        let normalMat=inverse(transpose(modelMat));
    
    
        gl.uniform4fv( envir["LocInShaders"]["ambientProductLoc"],flatten(ambientProduct) );
         gl.uniform4fv( envir["LocInShaders"]["diffuseProductLoc"],flatten(diffuseProduct) );
         gl.uniform4fv( envir["LocInShaders"]["specularProductLoc"],flatten(specularProduct) );
         gl.uniform4fv( envir["LocInShaders"]["lightPositionLoc"],flatten(envir["light"].lightPosition) );
         
         
         //console.log("materialShininess = "+ materialShininess);
         gl.uniform1f(envir["LocInShaders"]["shininessLoc"],materialShininess );
    
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
       let radius=envir["camera"].radius;
       let theta=envir["camera"].theta;
       let phi=envir["camera"].phi;

        let eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
        envir["viewer"].eye=eye;
        let at=envir["viewer"].at;
        let up=envir["viewer"].up;
        let viewMatrix=lookAt(eye, at , up);
       
         let modelViewMatrix = mult(viewMatrix,modelMat);
         let projectionMatrix = ortho(envir["viewport"].left, 
                                    envir["viewport"].right,
                                    envir["viewport"].bottom, 
                                    envir["viewport"].ytop, 
                                    envir["camera"].near, 
                                    envir["camera"].far);
    
         let  modelViewMatrix_3 = [
            vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
            vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
            vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
        ];
         modelViewMatrix_3.matrix=true;
         let normalMatrix=inverse(transpose(modelViewMatrix_3));
         gl.uniformMatrix4fv( envir["LocInShaders"]["modelViewMatrixLoc"], false, flatten(modelViewMatrix) );
         gl.uniformMatrix4fv( envir["LocInShaders"]["projectionMatrixLoc"], false, flatten(projectionMatrix) );
         gl.uniformMatrix3fv(envir["LocInShaders"]["normalMatrixLoc"], false, flatten(normalMatrix) );
    
    
         gl.uniformMatrix4fv( envir["LocInShaders"]["modelMatrixLoc"], false, flatten(modelMat) );
         gl.uniformMatrix4fv(envir["LocInShaders"]["viewMatrixLoc"], false, flatten(viewMatrix) );
         gl.uniformMatrix4fv(envir["LocInShaders"]["normalMatLoc"], false, flatten(normalMat) );
    
        
         eye=vec4(eye[0],eye[1],eye[2],1.0);
        gl.uniform4fv(envir["LocInShaders"]["eyePositionLoc"], flatten(eye));
    
         gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    }
    return mainRender;
}
window.onload=function init(){
    let Vue_1= new Vue({
        el:"#mainDiv_1",
        data:{
            envir:{},
            geoType:"cube",
            xRot:0,
            yRot:0,
            zRot:0,
            normalMethod:"defination",
            subDivDepth:4,
            m_diffuseColorHex:"#EEEEEE",
            m_specularColorHex:"#AAAAAA",
            m_ambientColorHex:"#DDDDDD",
            m_shininess:3,
            l_diffuseColorHex:"#DDDDDD",
            l_specularColorHex:"#CCCCCC",
            l_ambientColorHex:"#333333",
            isMovingLight:false,
            isShowShaderEditor:false,
            ShaderEditorBtnStr:"Edit Shader",
            //

            vertexShader:document.querySelector("#mainDiv_1 .vertexShader").value,
            fragmentShader:document.querySelector("#mainDiv_1 .fragmentShader").value,

        },
        methods:{
            updateShader:function(){
                let vm=this; 
                let envir=vm["envir"]
                _updateShader(envir);
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
            geoType:function(val){
                let vm=this; 
                let envir=vm["envir"]
                changeGeo(val,envir);
            },
            normalMethod:function(val){
                let vm=this; 
                let envir=vm["envir"]
                changeGeo(val,envir);
            },
            subDivDepth:function(val){
                let vm=this; 
                let envir=vm["envir"]
                changeGeo(val,envir);
            }

    }
}
    );

 /*   //camera and viewport parameter
   let near = -10;
   let far = 10;
   let radius = 1.5;
   let theta  = 0.0;
   let phi    = 0.0;
    
   
   let left = -3.0;
   let right = 3.0;
   let ytop =3.0;
   let bottom = -3.0;
   //viewer parameter
   let eye;
   let at = vec3(0.0, 0.0, 0.0);
   let up = vec3(0.0, 1.0, 0.0);
   //light parameter
   let lightTheta=Math.PI/4;
   let lightDelta=1/this.Math.PI;
   let lightPosition = vec4(-1.5*Math.cos(lightTheta),-1.5*Math.sin(lightTheta),1.0, 0.0 ); */
   //set up envir
   let WebGLEnvir_1=setUpWebGlEnvironment_VerII("mainDiv_1",Vue_1);
   configWebGL(WebGLEnvir_1);
   Vue_1.$data.envir=WebGLEnvir_1;
   addColorCubeToEnvir(WebGLEnvir_1);
   //addSubDivSphereToEnvir(WebGLEnvir,5,Vue_1.$data["normalMethod"])
   bufferDataToGPU(WebGLEnvir_1);

   let Vue_2= new Vue({
    el:"#mainDiv_2",
    data:{
        envir:{},
        geoType:"cube",
        xRot:0,
        yRot:0,
        zRot:0,
        radius:1,
        phi:0,
        theta:0,
        normalMethod:"defination",
        subDivDepth:4,
        m_diffuseColorHex:"#EEEEEE",
        m_specularColorHex:"#AAAAAA",
        m_ambientColorHex:"#DDDDDD",
        m_shininess:3,
        l_diffuseColorHex:"#DDDDDD",
        l_specularColorHex:"#CCCCCC",
        l_ambientColorHex:"#333333",
        isMovingLight:false,
        isShowShaderEditor:false,
        ShaderEditorBtnStr:"Edit Shader",
        //

        vertexShader:document.querySelector("#mainDiv_2 .vertexShader").value,
        fragmentShader:document.querySelector("#mainDiv_2 .fragmentShader").value,

    },
    methods:{
        updateShader:function(){
            let vm=this; 
            let envir=vm["envir"]
            _updateShader(envir);
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
        geoType:function(val){
            let vm=this; 
            let envir=vm["envir"];
            changeGeo(val,envir);
        },
        normalMethod:function(val){
            let vm=this; 
            let envir=vm["envir"];
            changeGeo(val,envir);
        },
        subDivDepth:function(val){
            let vm=this; 
            let envir=vm["envir"];
            changeGeo(val,envir);
        },
        radius:function(val){
            let vm=this; 
            let envir=vm["envir"];
            envir["camera"].radius=val;
        },
        theta:function(val){
            let vm=this; 
            let envir=vm["envir"];
            envir["camera"].theta=val/180*(Math.PI);
        },
        phi:function(val){
            let vm=this; 
            let envir=vm["envir"];
            envir["camera"].phi=val/180*(Math.PI);
        }
}
}
);
let WebGLEnvir_2=setUpWebGlEnvironment_VerII("mainDiv_2",Vue_2);
configWebGL(WebGLEnvir_2);
Vue_2.$data.envir=WebGLEnvir_2;
addColorCubeToEnvir(WebGLEnvir_2);
//addSubDivSphereToEnvir(WebGLEnvir,5,Vue_1.$data["normalMethod"])
bufferDataToGPU_1(WebGLEnvir_2);
Vue_2.$data.radius=WebGLEnvir_2["camera"].radius;
Vue_2.$data.theta=WebGLEnvir_2["camera"].theta/(Math.PI)*180;
Vue_2.$data.phi=WebGLEnvir_2["camera"].phi/(Math.PI)*180;
 

   //generate render function
let mainRender = function() {
    //get envir
    let numVertices=WebGLEnvir_1["numVertices"];
     //console.log("numVertices = "+numVertices);
    if(numVertices==0)return;
    let gl=WebGLEnvir_1["gl"];
   let envir=WebGLEnvir_1;
  
  let isMovingLight=Vue_1.$data["isMovingLight"];
    //console.log("isMovingLight = "+isMovingLight);
    if(isMovingLight=="true"||isMovingLight==true){
       
        lightTheta+=lightDelta;
        lightPosition = vec4(1.5*Math.cos(lightTheta),1.5*Math.sin(lightTheta),1.0, 0.0 );
    }
    
    let lightAmbient = convertHexColorToVec4(Vue_1.$data["l_ambientColorHex"]);
    let lightDiffuse = convertHexColorToVec4(Vue_1.$data["l_diffuseColorHex"]);
    let lightSpecular = convertHexColorToVec4(Vue_1.$data["l_specularColorHex"]);

    let materialAmbient =convertHexColorToVec4(Vue_1.$data["m_ambientColorHex"]);
    let materialDiffuse =convertHexColorToVec4(Vue_1.$data["m_diffuseColorHex"]);
    let materialSpecular =convertHexColorToVec4(Vue_1.$data["m_specularColorHex"]);
    let materialShininess =Number(Vue_1.$data["m_shininess"]); 
 

/* var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0; */


    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

    let xRot = Number(Vue_1.$data["xRot"]);
    let yRot = Number(Vue_1.$data["yRot"]);
    let zRot = Number(Vue_1.$data["zRot"]);
    let modelMat=mult(rotateZ_M(zRot),mult(rotateY_M(yRot),rotateX_M(xRot)));
    modelMat=mult(scaleM(2,2,2),modelMat);
    let normalMat=inverse(transpose(modelMat));


    gl.uniform4fv( envir["LocInShaders"]["ambientProductLoc"],flatten(ambientProduct) );
     gl.uniform4fv( envir["LocInShaders"]["diffuseProductLoc"],flatten(diffuseProduct) );
     gl.uniform4fv( envir["LocInShaders"]["specularProductLoc"],flatten(specularProduct) );
     gl.uniform4fv( envir["LocInShaders"]["lightPositionLoc"],flatten(lightPosition) );
     
     
     //console.log("materialShininess = "+ materialShininess);
     gl.uniform1f(envir["LocInShaders"]["shininessLoc"],materialShininess );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
    radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    let viewMatrix=lookAt(eye, at , up);
   
     let modelViewMatrix = mult(viewMatrix,modelMat);
     let projectionMatrix = ortho(left, right, bottom, ytop, near, far);

     let  modelViewMatrix_3 = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
     modelViewMatrix_3.matrix=true;
     let normalMatrix=inverse(transpose(modelViewMatrix_3));
     gl.uniformMatrix4fv( envir["LocInShaders"]["modelViewMatrixLoc"], false, flatten(modelViewMatrix) );
     gl.uniformMatrix4fv( envir["LocInShaders"]["projectionMatrixLoc"], false, flatten(projectionMatrix) );
     gl.uniformMatrix3fv(envir["LocInShaders"]["normalMatrixLoc"], false, flatten(normalMatrix) );


     gl.uniformMatrix4fv( envir["LocInShaders"]["modelMatrixLoc"], false, flatten(modelMat) );
     gl.uniformMatrix4fv(envir["LocInShaders"]["viewMatrixLoc"], false, flatten(viewMatrix) );
     gl.uniformMatrix4fv(envir["LocInShaders"]["normalMatLoc"], false, flatten(normalMat) );

    
     eye=vec4(eye[0],eye[1],eye[2],1.0);
    gl.uniform4fv(envir["LocInShaders"]["eyePositionLoc"], flatten(eye));

     gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
let mainRender_1=buildMainRender(WebGLEnvir_1,Vue_1);
let mainRender_2=buildMainRender(WebGLEnvir_2,Vue_2);
setInterval(
    function(){
        requestAnimationFrame(mainRender_1);
    },
    1000/10
    );
setInterval(
        function(){
            requestAnimationFrame(mainRender_2);
        },
        1000/10
        );
}







