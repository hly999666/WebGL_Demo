
var ButtonToHideDiv={
  btn:undefined,
  div:undefined,
  btnInner:undefined,
  onClickEvent:function(){
    /*
    var username=document.getElementById("username");
    if(username==undefined){
      window.location = "/login";
      return;
    }
    */
    if(div.style.display==="none"){
      btn.innerText="Close Input";
      btn.style.backgroundColor="rgb(242, 222, 222)";
      btn.style.color="black";
      div.style.display="block";
     }else{ 
       btn.innerText=btnInner;
       btn.style.backgroundColor="rgb(120,180,120)";
       btn.style.color="white";
       div.style.display="none";    
     }
    },
  setup:function(_btnId,_divId,onclick){
    btn=document.getElementById(_btnId);
    div=document.getElementById(_divId);
    btnInner=btn.innerText;
    if(onclick!=undefined){this.onClickEvent=onclick;};
    div.style.display="none";
    btn.addEventListener("click",this.onClickEvent);
  }
}