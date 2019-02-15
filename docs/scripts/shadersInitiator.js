var vertexShaders={
    v21:"attribute vec4 vertexPosition;void main(){gl_PointSize=2.0;gl_Position=vertexPosition;}"


}
var fragmentxShaders={
    f21:"precision mediump float; void main(){gl_FragColor=vec4(1.0,0.0,0.0,1.0);}"


}
function loadShaders(gl, vertexShaderId, fragmentShaderId ){
    var vertShdr;
    var fragShdr;
    var vertElem =vertexShaders[vertexShaderId];
    vertShdr = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vertShdr, vertElem);
    gl.compileShader( vertShdr );
    var fragElem =fragmentxShaders[fragmentShaderId];
    fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fragShdr, fragElem);
    gl.compileShader( fragShdr );
    
    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    return program;
}

