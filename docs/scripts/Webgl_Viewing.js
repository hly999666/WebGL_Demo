"use strict";
var Vue_1;


window.onload=function init(){
    Vue_1= new Vue({
        el:"#mainDiv_1",
        data:{
            isShowShaderEditor:false,
            near:1,
            far:1,
            radius:5,
            phi:0,
            theta:0,
            v_width:1,
            v_height :1
        },
        methods:{
            updateShader:function(){
                console.log("updateShader!!!");
            }
        }
    });
   
}







