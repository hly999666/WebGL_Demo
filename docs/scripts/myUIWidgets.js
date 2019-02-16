
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
  setup:function(_btnQ,_divQ,onclick){
    btn=document.querySelector(_btnQ)
    div=document.querySelector(_divQ);
    btnInner=btn.innerText;
    divDisplay=div.style.display;
    if(onclick!=undefined){this.onClickEvent=onclick;};
    div.style.display="none";
    btn.addEventListener("click",this.onClickEvent);
  }
}
function updateTextArea(textAreaQ){
  var elem=document.querySelector(textAreaQ);
  elem.innerHTML=elem.value;
}