"use strict";
var WebGLModuleController={};
function FunctionPackage_SierpinskiGasket_TypePoint2D_Constructor(){
    var FunctionPackage_SierpinskiGasket_Type_Point=
    {
        configureWebGL: function(envir){
            envir.gl.viewport( 0, 0, envir.cnv.width,  envir.cnv.height);
            envir.gl.clearColor(0.8, 0.8, 0.8, 1.0);
            envir.gl.clear(envir.gl.COLOR_BUFFER_BIT);
        },
        mainCallBackDraw:"",
        setup :function(_envir){
            
            //var _containerID=cantainerID;
            //generate mainDraw function in this closure
        var envir=_envir;
        var fp=this;
        fp.configureWebGL(envir);
        this.mainCallBackDraw=function()
        {
            fp.getInput(envir);
            envir.shadersProgram=configShaders(envir.gl, envir.cantainerID);
            fp.produceGeometryData(envir);
            fp.sendDataToGPU(envir);
            fp.mainRender(envir);
        }
        envir.viewPortUIControler=ButtonToHideDivControllerConstructor(envir.cantainerID+" .btnToggleForm_viewport",envir.cantainerID+" .shaderInput",FuncPackage());
        document.querySelector(envir.cantainerID+" .inputRangeElem").addEventListener("change",this.mainCallBackDraw);
        document.querySelector(envir.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",this.mainCallBackDraw);
        },
        getInput:function(envir){
            var sliderBar=document.querySelector(envir.cantainerID+" .inputRangeElem");
            envir.inputVar.sliderBarInput=Number(sliderBar.value);   
            var inputDisplay1=document.querySelector(envir.cantainerID+" .inputDisplay1");
            inputDisplay1.innerText=" "+envir.inputVar.sliderBarInput;
            if(envir.inputVar.sliderBarInput<=0){
                envir.gl.clear(envir.gl.COLOR_BUFFER_BIT );
                return;
            };
        },
        produceGeometryData:function(envir){
            var numPoints = envir.inputVar.sliderBarInput;
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
            envir.dataSet.Points=points;
        },
        sendDataToGPU:function(envir){
           var bufferId=  envir.gl.createBuffer();
            envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  bufferId);
            envir.gl.bufferData(  envir.gl.ARRAY_BUFFER, flattenArrayOfVectors( envir.dataSet.Points),  envir.gl.STATIC_DRAW );
            envir.bufferIds["vPos"]=bufferId;
            this.associateCurrentDataInShaders(envir,"vertexPosition", envir.bufferIds["vPos"]);
        },
        associateCurrentDataInShaders:function(envir,nameInShader,bufferID){
            envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  bufferID);
            envir.LocInShaders[nameInShader]= envir.gl.getAttribLocation(  envir.shadersProgram,nameInShader );
            envir.gl.vertexAttribPointer( envir.LocInShaders[nameInShader], 3,  envir.gl.FLOAT, false, 0, 0 );
            envir.gl.enableVertexAttribArray( envir.LocInShaders[nameInShader] );
        },
        mainRender:function(envir){ 
            envir.gl.clear( envir.gl.COLOR_BUFFER_BIT);
            envir.gl.drawArrays(envir.gl.POINTS, 0, envir.inputVar.sliderBarInput);
        }
    }

    return FunctionPackage_SierpinskiGasket_Type_Point;
}


function FunctionPackage_SierpinskiGasket_TypePolygon2D_Constructor(){

    var FunctionPackage=FunctionPackage_SierpinskiGasket_TypePoint2D_Constructor();
   
    FunctionPackage.produceGeometryData=function(envir){
        //console.log("on Type_Polygon");
        var verticesBasic = [
            vec3(-1.0, -1.0,0.0),
            vec3(0.0, 1.0,0.0),
            vec3(1.0, -1.0,0.0)
            ];
        envir.dataSet.Points=[];
        function produceTriangles(a,b,c,level){
            if(level==0){
                envir.dataSet.Points.push(a);
                envir.dataSet.Points.push(b);
                envir.dataSet.Points.push(c);
                return;
            }
            var ab = mix(a, b, 0.5);
            var bc = mix(b, c, 0.5);
            var ca = mix(c, a, 0.5);
            produceTriangles(a,ab,ca,level-1);
            produceTriangles(b,ab,bc,level-1);
            produceTriangles(c,bc,ca,level-1);
        }
        var level = envir.inputVar.sliderBarInput;
        produceTriangles(verticesBasic[0],verticesBasic[1],verticesBasic[2],level);
    }
    
    FunctionPackage.mainRender=function(envir){
        envir.gl.clear(  envir.gl.COLOR_BUFFER_BIT );
       
        //envir.gl.drawArrays(envir.gl.POINTS, 0, envir.dataSet.Points.length/2);
        envir.gl.drawArrays(envir.gl.TRIANGLES, 0, envir.dataSet.Points.length);
    }
    return FunctionPackage;
    
    
    }

function FunctionPackage_SierpinskiGasket_TypePoint3D_Constructor(){

        var FunctionPackage=FunctionPackage_SierpinskiGasket_TypePoint2D_Constructor();
    
        FunctionPackage.produceGeometryData=function(envir){
            //console.log("on Type_Polygon");
            var numPoints = envir.inputVar.sliderBarInput;
            var vertices = [
            vec3(-1.0, -1.0,1.0),
            vec3(0.0, 1.0,1.0),
            vec3(1.0, -1.0,1.0),
            vec3(0.0, 0.0,-1.0),
            ];
             
            /* 
            
             var vertices = [
            vec2(-1.0, -1.0),
            vec2(0.0, 1.0),
            vec2(1.0, -1.0)
            ];
            */
            var points = [vec3(0,0,0)];
            for (var i = 0; points.length < numPoints; ++i) {
            var j = Math.floor(Math.random() *4);
            var p = mix(points[points.length-1], vertices[j], 0.5);
            points.push(p);
            }
            envir.dataSet.Points=points;
        }
        /*
        FunctionPackage.mainRender=function(envir){
            envir.gl.clear(  envir.gl.COLOR_BUFFER_BIT );
           
            //envir.gl.drawArrays(envir.gl.POINTS, 0, envir.dataSet.Points.length/2);
            envir.gl.drawArrays(envir.gl.TRIANGLES, 0, envir.dataSet.Points.length);
        }
        
        */

        return FunctionPackage;
        
        
        }
function FunctionPackage_SierpinskiGasket_TypePolygon3D_Constructor(){
    var FunctionPackage=FunctionPackage_SierpinskiGasket_TypePolygon2D_Constructor();
    FunctionPackage.configureWebGL=function(envir){
        envir.gl.enable(envir.gl.DEPTH_TEST);
        envir.gl.viewport( 0, 0, envir.cnv.width,  envir.cnv.height);
        envir.gl.clearColor(0.8, 0.8, 0.8, 1.0);
        envir.gl.clear(envir.gl.COLOR_BUFFER_BIT);

    };
    FunctionPackage.produceGeometryData=function(envir){

        var vertices = [
            vec3(0.0, 0.0,0.0),
            vec3(-1.0, -1.0,1.0),
            vec3(0.0, 1.0,1.0),
            vec3(1.0, -1.0,1.0)
           
            ];
        /*
        
        
        
        
        
        
        */

            var colorTable= [
            vec3(1.0, 0.0, 0.0),
            vec3(0.0, 1.0, 0.0),
            vec3(0.0, 0.0, 1.0),
            vec3(0.0, 0.0, 0.0)
            ];
        envir.dataSet.vPos=[];
        envir.dataSet.vColor=[];
        var produceTriangles=function(a,b,c,cid){
            envir.dataSet.vColor.push(colorTable[cid]);
            envir.dataSet.vPos.push(a);
            envir.dataSet.vColor.push(colorTable[cid]);
            envir.dataSet.vPos.push(b);
            envir.dataSet.vColor.push(colorTable[cid]);
            envir.dataSet.vPos.push(c);
            return;
        }
        var produceTetrahedron=function(a,b,c,d,level){
            if(level==0){
                produceTriangles(a,b,c,0);
                produceTriangles(a,b,d,1);
                produceTriangles(a,c,d,2);
                produceTriangles(b,c,d,3);
                return;
            }
            var ab = mix(a, b, 0.5);
            var ac = mix(a, c, 0.5);
            var ad = mix(a,d, 0.5);
            var bc = mix(b,c, 0.5);
            var bd = mix(b,d, 0.5);            
            var cd = mix(c,d, 0.5);
            produceTetrahedron(a,ab,ac,ad,level-1);
            produceTetrahedron(b,ab,bc,bd,level-1);
            produceTetrahedron(c,bc,ac,cd,level-1);
            produceTetrahedron(d,ad,bd,cd,level-1);
        }
        var level = envir.inputVar.sliderBarInput;
        produceTetrahedron(vertices[0],vertices[1],vertices[2],vertices[3],level);
    };
    FunctionPackage.sendDataToGPU=function(envir){

        var vPosbuffer=  envir.gl.createBuffer();
          
        envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  vPosbuffer);
        envir.gl.bufferData(  envir.gl.ARRAY_BUFFER, flattenArrayOfVectors( envir.dataSet.vPos),  envir.gl.STATIC_DRAW );
        //binding data must be done at immediately after bufferData();
        envir.bufferIds.vPos=vPosbuffer;
        this.associateCurrentDataInShaders(envir,"vPos", envir.bufferIds.vPos);
        
        var vColorbuffer=  envir.gl.createBuffer();
        //binding data must be done at immediately after bufferData();
        envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  vColorbuffer);
        envir.gl.bufferData(  envir.gl.ARRAY_BUFFER, flattenArrayOfVectors( envir.dataSet.vColor),  envir.gl.STATIC_DRAW );
        envir.bufferIds.vColor=vColorbuffer;
        this.associateCurrentDataInShaders(envir,"vColor",envir.bufferIds.vColor);
    };
    FunctionPackage.mainRender=function(envir){
        envir.gl.clear(  envir.gl.COLOR_BUFFER_BIT| envir.gl.DEPTH_BUFFER_BIT );
       
        //envir.gl.drawArrays(envir.gl.POINTS, 0, envir.dataSet.Points.length/2);
        envir.gl.drawArrays(envir.gl.TRIANGLES, 0, envir.dataSet.vPos.length);
    };
    return FunctionPackage;
}


window.onload=function init(){
    
   
    //document.getElementById("BTN").addEventListener("click",drawSG);
    //var ctx2D=cnv.getContext("2d");
    WebGLModuleController["WebGLModule_1"]=WebGLModuleControllerConstructor("WebGLModule_1",FunctionPackage_SierpinskiGasket_TypePoint2D_Constructor());
    //settingCanvas();
    WebGLModuleController["WebGLModule_2"]=WebGLModuleControllerConstructor("WebGLModule_2",FunctionPackage_SierpinskiGasket_TypePolygon2D_Constructor());
    WebGLModuleController["WebGLModule_2"].FunctionPackage.mainCallBackDraw();
    WebGLModuleController["WebGLModule_2"]=WebGLModuleControllerConstructor("WebGLModule_3",FunctionPackage_SierpinskiGasket_TypePoint3D_Constructor());
    WebGLModuleController["WebGLModule_2"]=WebGLModuleControllerConstructor("WebGLModule_4",FunctionPackage_SierpinskiGasket_TypePolygon3D_Constructor());
    WebGLModuleController["WebGLModule_2"].FunctionPackage.mainCallBackDraw();
}



///






