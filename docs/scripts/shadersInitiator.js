function configShaders(gl,cantainerID){
    updateTextArea(cantainerID+" .vertexShader");updateTextArea(cantainerID+" .fragmentShader");
    var shadersProgram = loadShaders( gl, cantainerID+" .vertexShader",cantainerID+" .fragmentShader" );
    gl.useProgram( shadersProgram );
    return shadersProgram;
}
function configShaders_VerII(envir){
    let gl=envir["gl"];
    let vertElem=envir["vueInstance"].$data["vertexShader"];
    let fragElem=envir["vueInstance"].$data["fragmentShader"];
    var shadersProgram = _loadShaders( gl, vertElem,fragElem );
    gl.useProgram( shadersProgram );
    return shadersProgram;
}
function loadShaders(gl, vertexShaderQ, fragmentShaderQ){
    var vertElem =document.querySelector(vertexShaderQ).innerHTML;
    var fragElem =document.querySelector(fragmentShaderQ).innerHTML;

    return _loadShaders(gl,vertElem,fragElem);
}
function _loadShaders(gl, vertElem, fragElem){
    var vertShdr;
    var fragShdr;
    vertShdr = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vertShdr, vertElem);
    gl.compileShader( vertShdr );
    fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fragShdr, fragElem);
    gl.compileShader( fragShdr );
    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    return program;
}