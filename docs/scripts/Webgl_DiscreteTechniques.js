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
function bufferDataToGPU(envir,isChnageTexture){
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

   let Vue=envir["vueInstance"];

     let texType_1=Vue["texType_1"];
      let texDir_1=Vue["texDir_1"];
      let tex_re_nun_1=Number(Vue["tex_re_nun_1"]);

      
     let texType_2=Vue["texType_2"];
     let texDir_2=Vue["texDir_2"];
     let tex_re_nun_2=Number(Vue["tex_re_nun_2"]);
     let image_1;let image_2;let texture1;let texture2;
  if(isChnageTexture){
        image_1=generateCheckerBoard(texSize,4);
      if(texType_1=="None")image_1= generatePureColor(texSize,[1.0,1.0,1.0,1.0]);
      else if(texType_1=="Image")image_1= document.getElementById("texImage_1");
      else if(texType_1=="CheckerBoard")image_1= generateCheckerBoard(texSize,tex_re_nun_1);
      else if(texType_1=="Stripe")image_1=generateStripe(texSize,tex_re_nun_1,texDir_1);
      else if(texType_1=="Sinusoid")image_1=generateSinusoid(texSize);
        image_2= document.getElementById("texImage_1");
      if(texType_2=="None")image_2= generatePureColor(texSize,[1.0,1.0,1.0,1.0]);
      else if(texType_2=="Image")image_2= document.getElementById("texImage_1");
      else if(texType_2=="CheckerBoard")image_2= generateCheckerBoard(texSize,tex_re_nun_2);
      else if(texType_2=="Stripe")image_2=generateStripe(texSize,tex_re_nun_2,texDir_2);
      else if(texType_2=="Sinusoid")image_2=generateSinusoid(texSize);
      texture1=configureTexture(image_1,envir,texType_1=="Image");
      texture2 =configureTexture(image_2,envir,texType_2=="Image");
}else{
    image_1=generateCheckerBoard(texSize,4);
    image_2= document.getElementById("texImage_1");
    texture1=configureTexture(image_1,envir,false);
    texture2 =configureTexture(image_2,envir,true);
}
    envir["textures"].push(texture1);
    envir["textures"].push(texture2);
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
    let type=envir["vueInstance"]["cubeMapType"];
    let cubeMap=configureSimpleCubeMap(envir,type);
    gl.activeTexture( gl.TEXTURE2 );
    gl.bindTexture( gl.TEXTURE_CUBE_MAP, cubeMap );
    gl.uniform1i(gl.getUniformLocation( program, "cubeMap"), 2);
    let isLit=1;
    gl.uniform1i(gl.getUniformLocation(program, "isLit"),isLit);
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
function buildChangeLight_I(envir){
    let changeLight=function(){
        envir["light"].lightTheta+= envir["light"].lightDelta;
        let lightTheta=envir["light"].lightTheta;
        envir["light"].lightPosition = vec4(1.5*Math.cos(lightTheta),1.5*Math.sin(lightTheta),1.0, 0.0 );
    }
    return changeLight;
}
function buildChangeLight_II(envir){
    let changeLight=function(){
        let time= envir["light"].time;
        envir["light"].lightPosition[0] = 5.5*Math.sin(0.01*time);
        envir["light"].lightPosition[2] = 5.5*Math.cos(0.01*time);
        envir["light"].time += 1;
    }
    return changeLight;
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
            envir["light"]["changeLight"]();
           /* 
            envir["light"].lightTheta+= envir["light"].lightDelta;
            let lightTheta=envir["light"].lightTheta;
            envir["light"].lightPosition = vec4(1.5*Math.cos(lightTheta),1.5*Math.sin(lightTheta),1.0, 0.0 ); */
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

function generateBumpMap(texSize){
    let data = new Array()
    for (var i = 0; i<= texSize; i++)  data[i] = new Array();
    for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
        data[i][j] = 0.0;
    for (var i = texSize/4; i<3*texSize/4; i++) 
    for (var j = texSize/4; j<3*texSize/4; j++)
        data[i][j] = 1.0;
    return data;
}

function bufferDataToGPU_3(envir,isChangeTexture){
    bufferDataToGPU_1(envir);
    let gl=envir["gl"];
    let program=envir["shadersProgram"];
    let texSize=128;

    let Vue=envir["vueInstance"];

    let texType_1=Vue["texType_1"];
     let texDir_1=Vue["texDir_1"];
     let tex_re_nun_1=Number(Vue["tex_re_nun_1"]);

     
     let image=generateCheckerBoard(texSize+1,4);
 if(isChangeTexture){
    image=generateCheckerBoard(texSize,4);
     if(texType_1=="None")image= generatePureColor(texSize+1,[1.0,1.0,1.0,1.0]);
     else if(texType_1=="Image")image= document.getElementById("texImage_1");
     else if(texType_1=="CheckerBoard")image= generateCheckerBoard(texSize+1,tex_re_nun_1);
     else if(texType_1=="Stripe")image=generateStripe(texSize+1,tex_re_nun_1,texDir_1);
     else if(texType_1=="Sinusoid")image=generateSinusoid(texSize+1);
}

 
    let textureArray=generateNormalFromBump(image,texSize,true);
    let texture=configureTextureFromRGBArray(textureArray,texSize,envir);
    gl.activeTexture( gl.TEXTURE3 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.uniform1i(gl.getUniformLocation( program, "bumpNormalMap"), 3);

    let normal=envir["global"].normal;
    let tangent= envir["global"].tangent;
    gl.uniform4fv( gl.getUniformLocation(program, "normal"),flatten(normal));
    gl.uniform3fv( gl.getUniformLocation(program, "objTangent"),flatten(tangent));
}
function setUpDetailEnvir_III(envir,Vue){
    envir["viewer"].eye= vec3(2.0, 2.0, 2.0);
    envir["viewer"].at = vec3(0.5, 0.0, 0.5);
    envir["viewer"].up = vec3(0.0, 1.0, 0.0);

    envir["global"].normal = vec4(0.0, 1.0, 0.0, 0.0);
    envir["global"].tangent = vec3(1.0, 0.0, 0.0);

    envir["light"].lightPosition = vec4(0.0, 2.0, 0.0, 1.0 );
    envir["light"]["time"]=0;
    Vue.$data.l_diffuseColorHex = "#FFFFFF";
    Vue.$data.m_diffuseColorHex = "#CCCCCC";
}
function setUpframeBuffer(envir){
    let gl=envir["gl"];
    let canvas=envir["canvas"];
    let height=canvas.height;
    let width=canvas.width;
    let texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
       gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);

// Allocate a frame buffer object

   let framebuffer = gl.createFramebuffer();
   envir["frameBuffers"]["colorID"]=framebuffer;
   gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);


// Attach color buffer

   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);



gl.bindFramebuffer(gl.FRAMEBUFFER, null);

}
function bufferDataToGPU_4(envir){
    let gl=envir["gl"];
    let program=envir["shadersProgram"];
    bufferDataToGPU(envir);
    gl.uniform1i(gl.getUniformLocation(program, "bufferID"),0);
}
function buildChangeTexture(envir,Vue){
    let gl=envir["gl"];
   
    let changeTexture=function(id){
        _updateShader(envir);
        bufferDataToGPU(envir,true);
}
    return changeTexture;
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
            texType_1:"CheckerBoard",
            
            texDir_1:"X",
            tex_re_nun_1:4,
            texType_2:"Image",
            texDir_2:"X",
            tex_re_nun_2:8,
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
            },
            texType_1:function(){
                let vm=this; 
                let envir=vm["envir"];
                envir["texuresFunc"]["changeTexture"](0);
            } ,
            texDir_1:function(){
                let vm=this; 
                let envir=vm["envir"];
                envir["texuresFunc"]["changeTexture"](0);
            } ,
            tex_re_nun_1:function(){
                let vm=this; 
                let envir=vm["envir"];
                envir["texuresFunc"]["changeTexture"](0);
            } ,
            texType_2: function(){
                let vm=this; 
                let envir=vm["envir"];
                envir["texuresFunc"]["changeTexture"](1);
            } ,
            texDir_2:function(){
                let vm=this; 
                let envir=vm["envir"];
                envir["texuresFunc"]["changeTexture"](1);
            } ,
            tex_re_nun_2:function(){
                let vm=this; 
                let envir=vm["envir"];
                envir["texuresFunc"]["changeTexture"](1);
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
   WebGLEnvir_1["light"]["changeLight"]=buildChangeLight_I(WebGLEnvir_1);
   WebGLEnvir_1["texuresFunc"]["changeTexture"]=buildChangeTexture(WebGLEnvir_1,Vue_1);
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
        cubeMapType:"colorCube",
        isLighting:true,
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
            if(val=="sphere")vm["radius"]=3.0;
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
        },
        cubeMapType:function(val){
            let vm=this; 
            let envir=vm["envir"];
            envir["texuresFunc"]["changeTexture"](val);
        },
        isLighting:function(val){
            let vm=this; 
            let envir=vm["envir"];
            let gl=envir["gl"];
            let program=envir["shadersProgram"];
            let isLit=envir["vueInstance"]["isLighting"];
            if(isLit)isLit=1;
            else isLit=0;
            gl.uniform1i(gl.getUniformLocation(program, "isLit"),isLit);
        }
}
}
);
let WebGLEnvir_2=setUpWebGlEnvironment_VerII("mainDiv_2",Vue_2);
configWebGL(WebGLEnvir_2);
Vue_2.$data.envir=WebGLEnvir_2;
WebGLEnvir_2["light"]["changeLight"]=buildChangeLight_I(WebGLEnvir_2);
addColorCubeToEnvir(WebGLEnvir_2);
//addSubDivSphereToEnvir(WebGLEnvir,5,Vue_1.$data["normalMethod"])

bufferDataToGPU_1(WebGLEnvir_2);
WebGLEnvir_2["texuresFunc"]["changeTexture"]=function(val){
    _updateShader(WebGLEnvir_2);
    bufferDataToGPU_1(WebGLEnvir_2);
}
Vue_2.$data.radius=WebGLEnvir_2["camera"].radius;
Vue_2.$data.theta=WebGLEnvir_2["camera"].theta/(Math.PI)*180;
Vue_2.$data.phi=WebGLEnvir_2["camera"].phi/(Math.PI)*180;
 
//window 3
let Vue_3= new Vue({
    el:"#mainDiv_3",
    data:{
        envir:{},
        geoType:"cube",
        xRot:50,
        yRot:-45,
        zRot:-10,
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
        texType_1:"CheckerBoard",
            
        texDir_1:"X",
        tex_re_nun_1:4,
        texType_2:"Image",
        texDir_2:"X",
        tex_re_nun_2:8,

        vertexShader:document.querySelector("#mainDiv_3 .vertexShader").value,
        fragmentShader:document.querySelector("#mainDiv_3 .fragmentShader").value,

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
            if(val=="sphere")vm["radius"]=3.0;
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
        },
        texType_1:function(){
            let vm=this; 
            let envir=vm["envir"];
            envir["texuresFunc"]["changeTexture"](0);
        } ,
        texDir_1:function(){
            let vm=this; 
            let envir=vm["envir"];
            envir["texuresFunc"]["changeTexture"](0);
        } ,
        tex_re_nun_1:function(){
            let vm=this; 
            let envir=vm["envir"];
            envir["texuresFunc"]["changeTexture"](0);
        } 
}
}
);
let WebGLEnvir_3=setUpWebGlEnvironment_VerII("mainDiv_3",Vue_3);
configWebGL(WebGLEnvir_3);
Vue_3.$data.envir=WebGLEnvir_3;
WebGLEnvir_3["light"]["changeLight"]=this.buildChangeLight_II(WebGLEnvir_3);
addSimpleSquareToEnvir(WebGLEnvir_3);
//addSubDivSphereToEnvir(WebGLEnvir,5,Vue_1.$data["normalMethod"])
setUpDetailEnvir_III(WebGLEnvir_3,Vue_3);
bufferDataToGPU_3(WebGLEnvir_3);
WebGLEnvir_3["texuresFunc"]["changeTexture"]=function(val){
    _updateShader(WebGLEnvir_3);
    bufferDataToGPU_3(WebGLEnvir_3,true);
}
Vue_3.$data.radius=WebGLEnvir_3["camera"].radius;
Vue_3.$data.theta=WebGLEnvir_3["camera"].theta/(Math.PI)*180;
Vue_3.$data.phi=WebGLEnvir_3["camera"].phi/(Math.PI)*180;


let Vue_4= new Vue({
    el:"#mainDiv_4",
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
        pick_result:"Please Click Above",
        vertexShader:document.querySelector("#mainDiv_4 .vertexShader").value,
        fragmentShader:document.querySelector("#mainDiv_4 .fragmentShader").value,

    },
    methods:{
        updateShader:function(){
            let vm=this; 
            let envir=vm["envir"];
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
let WebGLEnvir_4=setUpWebGlEnvironment_VerII("mainDiv_4",Vue_4);
configWebGL(WebGLEnvir_4);
Vue_4.$data.envir=WebGLEnvir_4;
addColorCubeToEnvir(WebGLEnvir_4);
WebGLEnvir_4["light"]["changeLight"]=buildChangeLight_I(WebGLEnvir_4);
//addSubDivSphereToEnvir(WebGLEnvir,5,Vue_1.$data["normalMethod"])
setUpframeBuffer(WebGLEnvir_4);
bufferDataToGPU_4(WebGLEnvir_4);


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
let mainRender_3=buildMainRender(WebGLEnvir_3,Vue_3);
let mainRender_4=buildMainRender(WebGLEnvir_4,Vue_4);

WebGLEnvir_4["canvas"].addEventListener("mousedown", function(event){
    let envir=WebGLEnvir_4;
    let gl=envir["gl"];
    let canvas=envir["canvas"];
    let program=envir["shadersProgram"];
    let numVertices=envir["numVertices"];
    let framebuffer= envir["frameBuffers"]["colorID"];
    //gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear( gl.COLOR_BUFFER_BIT);

    gl.uniform1i(gl.getUniformLocation(program, "bufferID"), 1);
    //gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    let height=canvas.height;
    let width=canvas.width;
    let cHeight=canvas.clientHeight;
    let cWidth=canvas.clientWidth;
    let x = event.offsetX/cWidth*width;
    let y = canvas.height -(event.offsetY/cHeight*height);
     x=Math.floor(x);
     y=Math.floor(y);
    //console.log([x,y]);
    let color = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
    //console.log(color);
    let cName=mappingRGBtoName(color);
    Vue_4.$data.pick_result=cName;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.uniform1i(gl.getUniformLocation(program, "bufferID"), 0);
    gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.uniform3fv(thetaLoc, theta);
    //gl.drawArrays(gl.TRIANGLES, 0, 36);
    mainRender_4();

});
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
setInterval(
            function(){
                requestAnimationFrame(mainRender_3);
            },
            1000/10
            );
setInterval(
                function(){
                    requestAnimationFrame(mainRender_4);
                },
                1000/10
                );
}







