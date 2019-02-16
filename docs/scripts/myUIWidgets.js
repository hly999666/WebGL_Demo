
  var ButtonToHideDivProto={
  btn:"",
  div:"",
  onClickEvent:"",
  setup: function(_btnQ,_divQ,onclick){
      var btn=document.querySelector(_btnQ)
      var div=document.querySelector(_divQ);
      this.btn=btn;
      this.div=div;
      var btnInner=this.btn.innerText;
      var divDisplay=this.div.style.display;
      if(onclick!=undefined){ this.onClickEvent=onclick;}
      else{
        //generate function in time using only basic type,avoiding scope problem
        this.onClickEvent=function(){
          /*
          var username=document.getElementById("username");
          if(username==undefined){
            window.location = "/login";
            return;
          }
          */
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
      };
      this.div.style.display="none";
      this.btn.addEventListener("click",this.onClickEvent);
    }
  }

function updateTextArea(textAreaQ){
  var elem=document.querySelector(textAreaQ);
  elem.innerHTML=elem.value;
}