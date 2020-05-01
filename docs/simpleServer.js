const PORT = 44564 ;
const HOST = "127.0.0.1";
const express=require("express");
const app=express();

app.use(express.static("E://Project//WebGL_Demo//docs"));

app.listen(PORT,HOST,function(){
    console.log("server start "+HOST+":"+PORT);
});
