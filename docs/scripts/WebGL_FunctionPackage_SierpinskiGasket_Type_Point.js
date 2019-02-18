var FunctionPackage_SierpinskiGasket_Type_Point=
{
    configureWebGL: function(envir){
        envir.gl.viewport( 0, 0, envir.cnv.width,  envir.cnv.height);
        envir.gl.clearColor(0.8, 0.8, 0.8, 1.0);
        envir.gl.clear(envir.gl.COLOR_BUFFER_BIT);
    },
    mainCallBackDraw:"",
    setupUI :function(_envir){
        //var _containerID=cantainerID;
        //generate mainDraw function in this closure
    var envir=_envir;
    var fp=this;
    this.mainCallBackDraw=function()
    {
        fp.getInput(envir);
        envir.shadersProgram=configShaders(envir.gl, envir.cantainerID);
        fp.produceGeometryData(envir);
        fp.sendDataToGPU(envir);
        fp.associateDataInShaders(envir);
        fp.mainRender(envir);
    }
    envir.viewPortUIControler=Object.create(ButtonToHideDivProto);
    envir.viewPortUIControler.setup(envir.cantainerID+" .btnToggleForm_viewport",envir.cantainerID+" .shaderInput",FuncPackage());
    document.querySelector(envir.cantainerID+" .inputRangeElem").addEventListener("change",this.mainCallBackDraw);
    document.querySelector(envir.cantainerID+" .btnUpdateShader_viewport").addEventListener("click",this.mainCallBackDraw);
    this.mainCallBackDraw();
    },
    getInput:function(envir){
        var sliderBar=document.querySelector(envir.cantainerID+" .inputRangeElem");
        var input_sliderBar=Number(sliderBar.value);   
        var inputDisplay=document.querySelector(envir.cantainerID+" .inputDisplay");
        inputDisplay.innerText=" "+input_sliderBar;
        envir.inputVar.input_sliderBar=input_sliderBar;
        if(input_sliderBar<=0){
            envir.gl.clear(envir.gl.COLOR_BUFFER_BIT );
            return;
        };
    },
    produceGeometryData:function(envir){
        envir.dataSet.Points=[];
        var numPoints = envir.inputVar.input_sliderBar;
        if(envir.inputVar.input_sliderBar==0)return;
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
        if(envir.dataSet.Points.length==0)return;
        envir.bufferId =  envir.gl.createBuffer();
        envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  envir.bufferId );
        envir.gl.bufferData(  envir.gl.ARRAY_BUFFER, flattenArrayOfVectors( envir.dataSet.Points),  envir.gl.STATIC_DRAW );
    },
    associateDataInShaders:function(envir){
        var vertexPositions = envir.gl.getAttribLocation(envir.shadersProgram, "vertexPosition" );
        envir.gl.vertexAttribPointer( vertexPositions, 3,  envir.gl.FLOAT, envir, 0, 0 );
        envir.gl.enableVertexAttribArray(vertexPositions);
    },
    mainRender:function(envir){
        if(envir.inputVar.input_sliderBar!=0){
            envir.gl.clear(  envir.gl.COLOR_BUFFER_BIT );
            envir.gl.drawArrays(envir.gl.POINTS, 0, envir.inputVar.input_sliderBar);
        }
    }
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