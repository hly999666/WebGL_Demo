function FunctionPackage_SierpinskiGasket_TypePolygon_Constructor(){

var FunctionPackage=FunctionPackage_SierpinskiGasket_TypePoint_Constructor();
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


