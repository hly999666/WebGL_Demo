function vec2(x,y)
{
    var result = [x,y];

    return result;
}
function vec3(x,y,z)
{
    var result = [x,y,z];

    return result;
}
function vec4(x,y,z,w)
{
    var result = [x,y,z,w];

    return result;
}
function scale( s, u )
{
    if ( !Array.isArray(u) ) {
        throw "ERROR_scale(): parameter_type_error";
    }

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( s * u[i] );
    }

    return result;
}
function addA( s, u )
{
    if ( !Array.isArray(u)|| !Array.isArray(s)) {
        throw "ERROR_addA(): parameter_type_error";
    }

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( s[i]+ u[i] );
    }

    return result;
}
function mix( u, v, s )
{
    if ( typeof s !== "number" ) {
        throw "ERROR_mix(): parameter_type_error";
    }

    if ( u.length != v.length ) {
        throw "ERROR_mix():vector_dimension_different";
    }

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( (1.0 - s) * u[i] + s * v[i] );
    }

    return result;
}

function flattenArrayOfVectors(v){
   var n = v[0].length*v.length;
   var pos = 0;
   var floats = new Float32Array( n );
   for ( var i = 0; i < v.length; i++ ) {
       for ( var j = 0; j < v[i].length; j++) {
           floats[pos] = v[i][j];pos++;
       }
   }
   return floats;
}
function flattenVector(v){
    var n = v.length;
    var floats = new Float32Array( n );
    var pos = 0;
  
    for ( var i = 0; i < v.length; i++ ) {
            floats[pos] = v[i];pos++;
    }
    return floats;
}