var maxVertexs=1<<16;
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
            p = mix(points[points.length-1], vertices[j], 0.5);
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
function FunctionPackage_RotationSquares_Constructor(){
    var FunctionPackage=FunctionPackage_SierpinskiGasket_TypePolygon3D_Constructor();
    FunctionPackage.produceGeometryData=function(envir){
        envir.dataSet.vPos = [
            vec3(0, 1,0),
            vec3(1, 0,0),
            vec3(-1, 0,0),
            vec3(0, -1,0)
            ];
        envir.dataSet.currentRoation=0;
    },
    FunctionPackage.sendDataToGPU=function(envir){
        envir.LocInShaders["uRoation"] = envir.gl.getUniformLocation(envir.shadersProgram, "uRoation1f");
        envir.gl.uniform1f(envir.LocInShaders["uRoation"],envir.dataSet.currentRoation);
        var vPosbuffer= envir.gl.createBuffer(); 
        envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER, vPosbuffer);
        envir.bufferIds["vPos"]=vPosbuffer;
        envir.gl.bufferData(  envir.gl.ARRAY_BUFFER, flattenArrayOfVectors( envir.dataSet.vPos),  envir.gl.STATIC_DRAW );
        this.associateCurrentDataInShaders(envir,"vPos",envir.bufferIds["vPos"]);
    },
    FunctionPackage.setup=function(_envir){
        //var _containerID=cantainerID;
        //generate mainDraw function in this closure
  
    var envir=_envir;
    var fp=this;
    fp.configureWebGL(envir);
    this.mainCallBackDraw=null;
    this.updateParam=function(){
        fp.getInput(envir);
    };
    
    this.updateShaders=function()
    {
        //fp.getInput(envir);
        envir.shadersProgram=configShaders(envir.gl, envir.cantainerID);
        //fp.produceGeometryData(envir);
        //fp.sendDataToGPU(envir);
        envir.LocInShaders["uRoation"] = envir.gl.getUniformLocation(envir.shadersProgram, "uRoation1f");
        fp.mainRender(envir);
    }
    this.mainRender=function(){
        var rotTheta=(envir.inputVar.sliderBarInput*2*Math.PI)/3600;
        envir.dataSet.currentRoation+=rotTheta*envir.inputVar.RotationDirection;
        //console.log( envir.dataSet.currentRoation);
        envir.gl.uniform1f(envir.LocInShaders["uRoation"], envir.dataSet.currentRoation);
        envir.gl.clear(envir.gl.COLOR_BUFFER_BIT)
        envir.gl.drawArrays(envir.gl.TRIANGLE_STRIP, 0, 4);
    }
    var mainRenderLocal=this.mainRender;
    this.myRequestAnimFrame=function(){
        window.requestAnimationFrame(mainRenderLocal);
    }
    this.updateParam();
    this.updateShaders();
    this.produceGeometryData(envir);
    this.sendDataToGPU(envir);
    //setInterval(function(){console.log("+1s")},1000);
    
    //shaderEditor UI
    envir.viewPortUIControler=ButtonToHideDivControllerConstructor(envir.cantainerID+" .btnToggleForm_viewport",envir.cantainerID+" .shaderInput",FuncPackage());
    document.querySelector(envir.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",this.updateShaders);
    //Rotation Direction
    envir.inputVar.RotationDirection=1;
    var RotDirBtn=document.querySelector("#RotDirectionDiv button");
    this.toggleRotationDirection=function(){
        if(envir.inputVar.RotationDirection==1){
            envir.inputVar.RotationDirection=-1;
            RotDirBtn.innerHTML="Clockwise"
        }else{
            envir.inputVar.RotationDirection=1;
            RotDirBtn.innerHTML="Reverse Clockwise"
        }
    }
    RotDirBtn.addEventListener("click",this.toggleRotationDirection);
    //FPS
    envir.inputVar.FPS=30;
    envir.inputVar.mainTimer=setInterval(this.myRequestAnimFrame,1000/30);
    var FPSselect=document.querySelector("#FPS_Div select");
    this.changeFPS=function(){
        envir.inputVar.FPS=Number(this.value);
        window.clearInterval(envir.inputVar.mainTimer);
        envir.inputVar.mainTimer=setInterval(fp.myRequestAnimFrame,1000/envir.inputVar.FPS);
    }
    FPSselect.addEventListener("change",this.changeFPS);
    //key board
    envir.inputVar.preRotSPD="10";
    this.toggleStopRotation=function(){
        var sliderBar=document.querySelector(envir.cantainerID+" .inputRangeElem");
        var display=document.querySelector(envir.cantainerID+" .currentRotStatus");
        var operationSpan=document.querySelector(envir.cantainerID+" .SpacebarOperation");
        if(sliderBar.value!="0"){
            envir.inputVar.preRotSPD=sliderBar.value;
            sliderBar.value="0";
            display.style.backgroundColor="rgb(180, 100, 100)";
            display.innerHTML="Stopped";
            operationSpan.innerHTML="Resume"
        }else{
            sliderBar.value=envir.inputVar.preRotSPD;
            display.style.backgroundColor="rgb(48, 121, 48)";
            display.innerHTML="Running";
            operationSpan.innerHTML="Stop"
        }
        this.updateParam();
    }
    this.keyEventListener=function(){
            switch (event.keyCode) {
            case 32: // spacebar
            fp.toggleStopRotation();
            break;
            }
    }
    window.addEventListener("keydown",this.keyEventListener );
    }
    return FunctionPackage;
}
function FunctionPackage_MouseDraw_Constructor(){
    var FunctionPackage=FunctionPackage_SierpinskiGasket_TypePolygon3D_Constructor();
    FunctionPackage.setup=function(_envir){
        var envir=_envir;
        var fp=this;
        fp.configureWebGL(envir);
  
        var cns_w=envir.cnv.width;
        var cns_h=envir.cnv.height;
        envir.inputVar.numsOfInputPoints=0;
        var gl=envir.gl;
        fp.mainRender=function(){
            if(envir.inputVar.numsOfInputPoints==0)return;
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0,envir.inputVar.numsOfInputPoints);
        }
       
        //create buffer
        envir.bufferIds["vPos"]=  envir.gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vPos"]);
        //set space
        gl.bufferData( gl.ARRAY_BUFFER, 8*maxVertexs, gl.STATIC_DRAW );
        envir.bufferIds["vColor"]=envir.gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER,  envir.bufferIds["vColor"]);
        gl.bufferData( gl.ARRAY_BUFFER, 8*maxVertexs, gl.STATIC_DRAW );
        fp.updateShadersAndAssociateData=function()
        {
            //fp.getInput(envir);
            envir.shadersProgram=configShaders(envir.gl, envir.cantainerID);
            //fp.produceGeometryData(envir);
            //fp.sendDataToGPU(envir);
            
            //associate data must be done at immediately after bindBuffer() (before next binding);
            fp.associateCurrentDataInShaders(envir,"vPos",  envir.bufferIds["vPos"]);
           
             //associate data must be done at immediately after bindBuffer();   
             fp.associateCurrentDataInShaders(envir,"vColor",envir.bufferIds["vColor"]);
            window.requestAnimationFrame( fp.mainRender);
        }
        fp.updateShadersAndAssociateData();


        fp.drawSingleTriangle=function(pointPos){
            var pointColor=randomVec3();
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vPos"]);
            var flatPP=flattenVector(pointPos);
            gl.bufferSubData(gl.ARRAY_BUFFER, 3*4* envir.inputVar.numsOfInputPoints,flatPP);
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vColor"]);
            var flatPC=flattenVector(pointColor);
            gl.bufferSubData(gl.ARRAY_BUFFER, 3*4* envir.inputVar.numsOfInputPoints, flatPC);
            envir.inputVar.numsOfInputPoints++;
            window.requestAnimationFrame( fp.mainRender);
        }
        fp.drawOneClickSqure=function(pointPos){
            var pointsByteLen= 3*4* envir.inputVar.numsOfInputPoints;
             var startPos=pointsByteLen-pointsByteLen%3;
            //Create Point
            var halfWidth=0.04;
            var a=vec3(pointPos[0]+halfWidth,pointPos[1]+halfWidth,0);
            var b=vec3(pointPos[0]+halfWidth,pointPos[1]-halfWidth,0);
            var c=vec3(pointPos[0]-halfWidth,pointPos[1]-halfWidth,0);
            var d=vec3(pointPos[0]-halfWidth,pointPos[1]+halfWidth,0);
            var vPos=[];
            vPos.push(a);vPos.push(b);vPos.push(d);
            vPos.push(c);vPos.push(b);vPos.push(d);
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vPos"]);
            gl.bufferSubData(gl.ARRAY_BUFFER, startPos,flattenArrayOfVectors(vPos));
            ////
            var pointColor=randomVec3();
            var vColor=[];
            vColor.push(pointColor);vColor.push(pointColor);vColor.push(pointColor);
            vColor.push(pointColor);vColor.push(pointColor);vColor.push(pointColor);
            gl.bindBuffer(gl.ARRAY_BUFFER,envir.bufferIds["vColor"]);
            gl.bufferSubData(gl.ARRAY_BUFFER, startPos, flattenArrayOfVectors(vColor));
            envir.inputVar.numsOfInputPoints+=6;
            window.requestAnimationFrame( fp.mainRender);
        }
        fp.clickCanvasEvent=function(){
            var pointPos=canvasPosToGLPos(event.offsetX,event.offsetY,cns_w,cns_h);
            var selection=document.querySelector(envir.cantainerID+" select").value;
             if(selection=="Single Triangle"){
                fp.drawSingleTriangle(pointPos);
             }
             if(selection=="One Click Squre"){
                fp.drawOneClickSqure(pointPos);
             }
        }

      
        //addEventListener
        envir.cnv.addEventListener("click",fp.clickCanvasEvent);

        envir.viewPortUIControler=ButtonToHideDivControllerConstructor(envir.cantainerID+" .btnToggleForm_viewport",envir.cantainerID+" .shaderInput",FuncPackage());
        document.querySelector(envir.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",fp.updateShadersAndAssociateData);
    }
    return FunctionPackage;
}