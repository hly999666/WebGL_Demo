
var ButtonToHideDiv={
  btn:undefined,
  div:undefined,
  btnInner:undefined,
  divDisplay:undefined,
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
      btn.style.backgroundColor="rgb(239, 203, 213)";
      btn.style.color="black";
      div.style.display=divDisplay;
     }else{ 
       btn.innerText=btnInner;
       btn.style.backgroundColor="rgb(54, 113, 164)";
       btn.style.color="white";
  
       div.style.display="none";    
     }
    },
  setup:function(_btnId,_divId,onclick){
    btn=document.getElementById(_btnId);
    div=document.getElementById(_divId);
    btnInner=btn.innerText;
    divDisplay=div.style.display;
    if(onclick!=undefined){this.onClickEvent=onclick;};
    div.style.display="none";
    btn.addEventListener("click",this.onClickEvent);
  }
}
function updateTextArea(textAreaID){
  var elem=document.getElementById(textAreaID);
  elem.innerHTML=elem.value;
}