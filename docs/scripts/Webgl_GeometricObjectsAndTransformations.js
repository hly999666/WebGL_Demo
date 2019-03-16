"use strict";
var WebGLModuleController={};
function FunctionPackage_RotatingCube_Constructor(){
    var FunctionPackage=WebGLModuleFunctionPackageConstructor();
    FunctionPackage.setup=function(_envir){
        //var _containerID=cantainerID;
        //generate mainDraw function in this closure
  
    var envir=_envir;
    var gl=envir.gl;
    var fp=this;
    fp.configureWebGL(envir);
  
    this.mainCallBackDraw=null;
    envir.numVertices=0;
      //create buffer
      envir.bufferIds["elementV"] = gl.createBuffer();
      envir.bufferIds["vPos"] = gl.createBuffer();
      envir.bufferIds["vColor"] = gl.createBuffer();
      //generate geometric date
      envir.dataSet["elementV"] = [];
      envir.dataSet["vPos"] =[];
      envir.dataSet["vColor"] =[];
      envir.InputVar={};
    this.updateShaders=function()
    {
        //fp.getInput(envir);
        envir.shadersProgram=configShaders(envir.gl, envir.cantainerID);
        //fp.produceGeometryData(envir);
        //fp.sendDataToGPU(envir);
        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vColor"] );
        envir.LocInShaders["vColor"] =gl.getAttribLocation( envir.shadersProgram, "vColor" );
        gl.vertexAttribPointer( envir.LocInShaders["vColor"], 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( envir.LocInShaders["vColor"] );

        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vPos"] );
        envir.LocInShaders["vPos"] = gl.getAttribLocation( envir.shadersProgram, "vPos" );
        gl.vertexAttribPointer( envir.LocInShaders["vPos"], 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( envir.LocInShaders["vPos"] );
        envir.LocInShaders["rotMatrix"] = gl.getUniformLocation( envir.shadersProgram, "rotMatrix" );
        if(envir.numVertices!=0)fp.mainRender();
    }
    this.sendDataToGPU=function(envir){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, envir.bufferIds["elementV"]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(envir.dataSet["elementV"] ), gl.STATIC_DRAW);
        //vColor
        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vColor"] );
        gl.bufferData( gl.ARRAY_BUFFER,  flattenArrayOfVectors(envir.dataSet["vColor"]), gl.STATIC_DRAW );
        //vPos
        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vPos"] );
        gl.bufferData( gl.ARRAY_BUFFER,  flattenArrayOfVectors(envir.dataSet["vPos"]), gl.STATIC_DRAW );

    }
    envir.InputVar["rotM"]=mat4();
    this.mainRender=function(){
        var rotM=envir.InputVar["rotM"];
        //console.log(envir.InputVar["currentRotation"]);
        if(envir.InputVar["currentRotation"][0]>0.001){
           var rv=envir.InputVar["currentRotation"];
           var rotAxis=rotateM(rv[0],vec3(rv[1],rv[3],rv[2]));
           rotAxis=mult(rotAxis,envir.InputVar["rotM"]);
           rotM=mult(rotAxis,rotM);
        }
        rotM=mult(rotM,rotateX_M(envir.inputVar.rotation[0]));
        rotM=mult(rotM,rotateY_M(envir.inputVar.rotation[1]));
        rotM=mult(rotM,rotateZ_M(envir.inputVar.rotation[2]));
        envir.InputVar["rotM"]=rotM;
        gl.uniformMatrix4fv(envir.LocInShaders["rotMatrix"], false, flatten(rotM));
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //console.log(envir.inputVar.DrawingMode);
        if(envir.inputVar.DrawingMode=="radioInterpolation"){
            gl.drawElements( gl.TRIANGLES, envir.numVertices,gl.UNSIGNED_SHORT, 0 );
        }else{
            gl.drawArrays(gl.TRIANGLES, 0,envir.numVertices);
        }
    }
    var mainRenderLocal=this.mainRender;
    this.myRequestAnimFrame=function(){
        window.requestAnimationFrame(mainRenderLocal);
    }
    this.updateShaders();
   
    //produce Geometry Data
    envir.inputVar.DrawingMode="radioInterpolation";
    var cube=WebGLModuleGeometricObjectConstructor({drawingMode:"Interpolation"});
    cube.addDataToEnvir(envir);
    this.sendDataToGPU(envir);
    this.myRequestAnimFrame();
    setInterval(this.myRequestAnimFrame,1000/30);
    
    //shaderEditor UI
    envir.viewPortUIControler=ButtonToHideDivControllerConstructor(envir.cantainerID+" .btnToggleForm_viewport",envir.cantainerID+" .shaderInput",FuncPackage());
    document.querySelector(envir.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",this.updateShaders);
   //keyEvent
    this.keyEvent=[];

   //RotateBtn UI
   envir.inputVar.rotation=[0,0,0];
   fp.rotationBtnListener=function(){
       if(this.classList.contains("RotateX"))envir.inputVar.rotation[0]+=3;
       if(this.classList.contains("RotateY"))envir.inputVar.rotation[1]+=3;
       if(this.classList.contains("RotateZ"))envir.inputVar.rotation[2]+=3;
       fp.mainRender();
   };
   document.querySelectorAll(envir.cantainerID+" .RotateBtnDiv>.btn").forEach(
      function(btn){
       btn.addEventListener("click",fp.rotationBtnListener);
      }
   );
    //DrawingMode UI
    fp.drawingModeListener=function(){
        if(this.classList[0]===envir.inputVar.DrawingMode)return;
        else {
            envir.inputVar.DrawingMode=this.classList[0];
            var cube;
            envir.numVertices=0;
            envir.dataSet["vPos"]=[];
            envir.dataSet["vColor"]=[];
            if(envir.inputVar.DrawingMode=="radioInterpolation"){
                cube=WebGLModuleGeometricObjectConstructor({form:"cube",drawingMode:"Interpolation"});
            }else{
                cube=WebGLModuleGeometricObjectConstructor({form:"cube",drawingMode:"Solid"});
            }
            cube.addDataToEnvir(envir);
            fp.sendDataToGPU(envir);
        }
    }

    document.querySelectorAll(envir.cantainerID+" .RadioDivDiv input").forEach(
        function(input){
            input.addEventListener("click", fp.drawingModeListener);
        }
     );
    //trackball UI
     envir.InputStatus={};
     envir.InputStatus["mouseDown"]=false;
     envir.InputVar["currentRotation"]=[0,0,0,0];
     document.querySelector(envir.cantainerID+" canvas").addEventListener("mousedown",
     function(){
         envir.InputStatus["mouseDown"]=true;
         envir.InputVar["trackballSensitivity"]= Number(document.querySelector(envir.cantainerID+" .inputRangeElem").value);
         var lastPos=canvasPosToGLClippingCoord(event.offsetX,event.offsetY,envir);
         envir.InputVar["mouseLastPoint"]=GLClippingCoordToUnitSphereCoord(lastPos[0],lastPos[1]);
         console.log("mouseDown");
     });
     document.querySelector(envir.cantainerID+" canvas").addEventListener("mouseup",
     function(){
         envir.InputStatus["mouseDown"]=false;
         envir.InputVar["currentRotation"][0]=0;
         console.log("mousup");
     });
     document.querySelector(envir.cantainerID+" canvas").addEventListener("mousemove",
     function(){
         if( envir.InputStatus["mouseDown"]){
            console.log("mousemove");
            var lastPoint=envir.InputVar["mouseLastPoint"];
            var nowPos=canvasPosToGLClippingCoord(event.offsetX,event.offsetY,envir);
            var nowPoint=GLClippingCoordToUnitSphereCoord(nowPos[0],nowPos[1]);
            console.log(nowPoint);
            var nowAxis=cross(lastPoint,nowPoint);
            envir.InputVar["currentRotation"][0]=Math.sqrt(dot(nowAxis,nowAxis))/512* envir.InputVar["trackballSensitivity"];
            envir.InputVar["currentRotation"][1]=nowAxis[0];
            envir.InputVar["currentRotation"][2]=nowAxis[1];
            envir.InputVar["currentRotation"][3]=nowAxis[2];
            envir.InputVar["mouseLastPoint"]=nowPoint;
            
         }
     });
    }
     //TrackBall UI
    return FunctionPackage;
}


window.onload=function init(){
    
     var nu=navigator.userAgent;
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    var keyEvent=[];
   
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_1",FunctionPackage_RotatingCube_Constructor(),keyEvent);
    //WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_2",FunctionPackage_MouseDraw_Constructor(),keyEvent);
    //settingCanvas();
    window.addEventListener("keydown",buildKeyEvent(keyEvent));    
}



///






