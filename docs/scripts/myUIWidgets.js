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
 function ButtonToHideDivControllerConstructor(_btnQ,_divQ,_funcPackage){


 var Controller={
    btn:"",
    div:"",
    funcPackage:"",
    btnInner:"",
    divDisplay:""
  }
        Controller.btn=document.querySelector(_btnQ);
        Controller.div=document.querySelector(_divQ);
        if(!Controller.btn||!Controller.div)return;
        Controller.funcPackage=_funcPackage;
        Controller.btnInner=Controller.btn.innerText;
        Controller.divDisplay=Controller.div.style.display;
        Controller.div.style.display="none";
        var defaultCallAtTime=function(){
          if(Controller.div.style.display==="none"){
            Controller.btn.innerText="Close Input";
            Controller.btn.style.backgroundColor="rgb(239, 203, 213)";
            Controller.btn.style.color="black";
            Controller.div.style.display= Controller.divDisplay;
           }else{ 
            Controller.btn.innerText=Controller.btnInner;
            Controller.btn.style.backgroundColor="rgb(54, 113, 164)";
            Controller.btn.style.color="white";
            Controller.div.style.display="none";    
           }
        }
          // care closure
          var onClickEvent=function(){
            Controller.funcPackage.callBefore();
            if(Controller.funcPackage.callAtTime!=nullFunction){
              Controller.funcPackage.callAtTime();
            }else{
              defaultCallAtTime();
            }
              Controller.funcPackage.callAfter();
            }
      
            Controller.btn.addEventListener("click",onClickEvent);
            return Controller;
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