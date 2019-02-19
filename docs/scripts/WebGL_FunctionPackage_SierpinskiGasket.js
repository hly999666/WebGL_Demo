function FunctionPackage_SierpinskiGasket_TypePoint2D_Constructor(){
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
            envir.bufferId =  envir.gl.createBuffer();
            envir.gl.bindBuffer(  envir.gl.ARRAY_BUFFER,  envir.bufferId );
            envir.gl.bufferData(  envir.gl.ARRAY_BUFFER, flattenArrayOfVectors( envir.dataSet.Points),  envir.gl.STATIC_DRAW );
        },
        associateDataInShaders:function(envir){
            var vertexPositions = envir.gl.getAttribLocation(  envir.shadersProgram, "vertexPosition" );
            envir.gl.vertexAttribPointer( vertexPositions, 3,  envir.gl.FLOAT, envir, 0, 0 );
            envir.gl.enableVertexAttribArray( vertexPositions );
        },
        mainRender:function(envir){
            envir.gl.clear(  envir.gl.COLOR_BUFFER_BIT );
            envir.gl.drawArrays(envir.gl.POINTS, 0, envir.inputVar.sliderBarInput);
        }
    }

    return FunctionPackage_SierpinskiGasket_Type_Point;
}


function FunctionPackage_SierpinskiGasket_TypePolygon2D_Constructor(){

    var FunctionPackage=FunctionPackage_SierpinskiGasket_TypePoint2D_Constructor();
    function produceTriangles(a,b,c,level,Points){
        if(level==0){
            Points.push(a);
            Points.push(b);
            Points.push(c);
            return;
        }
        var ab = mix(a, b, 0.5);
        var bc = mix(b, c, 0.5);
        var ca = mix(c, a, 0.5);
        produceTriangles(a,ab,ca,level-1,Points);
        produceTriangles(b,ab,bc,level-1,Points);
        produceTriangles(c,bc,ca,level-1,Points);
    }
    FunctionPackage.produceGeometryData=function(envir){
        //console.log("on Type_Polygon");
        var verticesBasic = [
            vec3(-1.0, -1.0,0.0),
            vec3(0.0, 1.0,0.0),
            vec3(1.0, -1.0,0.0)
            ];
        envir.dataSet.Points=[];
        var level = envir.inputVar.sliderBarInput;
        produceTriangles(verticesBasic[0],verticesBasic[1],verticesBasic[2],level,envir.dataSet.Points);
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