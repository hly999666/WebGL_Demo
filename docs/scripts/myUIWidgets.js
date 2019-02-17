var nullFunction=function(){return;};
function FuncPackage(_callBefore,_callAtTime,_callAfter){
   var fp={};
  if(typeof(_callBefore)=="function"){fp.callBefore=_callBefore;}
  else{fp.callBefore=nullFunction;};
  if(typeof(_callAtTime)=="function"){fp.callAtTime=_callAtTime;}
  else{fp.callAtTime=nullFunction;};
  if(typeof(_callAfter)=="function"){fp.callAfter=_callAfter;}
  else{fp.callAfter=nullFunction;};
  return fp;
 }
  var ButtonToHideDivProto={
  btn:"",
  div:"",
  setup: function(_btnQ,_divQ,_funcPackage){
      var btn=document.querySelector(_btnQ)
      var div=document.querySelector(_divQ);
      this.btn=btn;
      this.div=div;
      var funcPackage=_funcPackage;
      var btnInner=this.btn.innerText;
      var divDisplay=this.div.style.display;
      var defaultCallAtTime=function(){
        if( div.style.display==="none"){
          btn.innerText="Close Input";
          btn.style.backgroundColor="rgb(239, 203, 213)";
          btn.style.color="black";
          div.style.display= divDisplay;
         }else{ 
          btn.innerText= btnInner;
          btn.style.backgroundColor="rgb(54, 113, 164)";
          btn.style.color="white";
          div.style.display="none";    
         }
      }
        // care closure
        var onClickEvent=function(){
          funcPackage.callBefore();
          if(funcPackage.callAtTime!=nullFunction){
            funcPackage.callAtTime();
          }else{
            defaultCallAtTime();
          }
            funcPackage.callAfter();
          }
      this.div.style.display="none";
      this.btn.addEventListener("click",onClickEvent);
    }
  }

function updateTextArea(textAreaQ){
  var elem=document.querySelector(textAreaQ);
  elem.innerHTML=elem.value;
}
function isLogin() {
  var username=document.getElementById("username");
  if(username==undefined){
    window.location = "/login/PleaseLogin";
  }
}