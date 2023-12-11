const buttons=[0,1,2,3,4,5,6,7,8,9,'.','+','-','*','/','%','^2']

const buttonContainer = document.querySelector(".button-grid");
buttonContainer.addEventListener("click", handleClick);

state={
    num:true,  // can a number be typed, true or false
    dec:"with-zero",  // with zero or no or yes
    operator:false,  // can a operator be placed, true or false
    sq:false,      // can square be placed
    eq: false,     // can find the equal value
}

function evaluateState(value){
    if(value.length==0){
        state.num=true; state.dec="with-zero"; state.operator=false; state.sq=false; state.eq=false; return;
    }
    if(value.length==1){
        state.num=true; state.dec=true; state.operator=true; state.sq=true; state.equal=true; return;
    }
    c=value[value.length-2];
    if(c=='^'){
        state.num=false; state.dec=false; state.operator=true; state.sq=true; state.equal=true; return;
    }
    c=value[value.length-1];
    if(c=='+' || c=='-' || c=='/' || c=='*' || c=='%'){
        state.num=true; state.dec="with-zero"; state.operator=false; state.sq=false; state.equal=false;
    }else if(c=='.'){
        state.num=true; state.dec=false; state.operator="with-zero"; state.sq='with-zero'; state.equal='with-zero';
    }
    else{
        state.num=true; state.operator=true; state.sq=true; state.equal=true;
        i=value.length-2;
        state.dec=true;
        while(i>=0){
            c=value[i];
            if(c=='+' || c=='-' || c=='/' || c=='*' || c=='%') break;
            if(c=='.') { state.dec=false; break; }
            i--;
        }
    } 
}

function handleClick(event){
    const buttonId = event.target.id;
    const currentBox = document.getElementById("current");
    evaluateState(currentBox.value);
    console.log(state);
    currentBox.style.fontSize="15px";
    if(buttonId>=0 && buttonId<=9){
        if(state.num) currentBox.value+=buttons[buttonId]; 
    }
    if(buttonId==10){
        if(state.dec==true) currentBox.value+='.';
        else if(state.dec=='with-zero') currentBox.value+='0.';
    }
    if(buttonId>=11 && buttonId<=15){
        if(state.operator==true) currentBox.value+=buttons[buttonId];    
        else if(state.operator=='with-zero') currentBox.value+='0'+buttons[buttonId];
    }
    if(buttonId==16){
        if(state.sq==true) currentBox.value+='^2';
        else if(state.sq=='with-zero') currentBox.value+='0^2';
    }
    if(buttonId==17){
        let val=currentBox.value;
        if(val.length==0) return;
        currentBox.value=val.substring(0,val.length-1);
    }
    if(buttonId==18){
        currentBox.value="";
        const pastBox=document.getElementById("past");
        pastBox.value="";
    }
    if(buttonId==19){
        const pastBox=document.getElementById("past");
        if(state.equal==false) return;
        if(state.equal=='with-zero') currentBox.value+='0';
        evaluate(currentBox,pastBox);
    }
    // evaluateState(currentBox.value);
    // console.log(state);
}

function evaluate(currentBox,pastBox){
    expression=currentBox.value;
    // Split the expression into tokens using regular expression
    tokens = expression.match(/[^\d.]+|\d+\.\d*|\d+/g);

    i=0;
    l=tokens.length;
    newtokens=[];
    while(i<l){
        if(tokens[i]!='^'){
            newtokens.push(tokens[i]); i++; continue;
        }
        x=parseFloat(newtokens[i-1]);
        newtokens[i-1]=x*x;
        i+=2;
    }
    tokens=newtokens;

    i=0;
    l=tokens.length;
    newtokens=[];
    while(i<l){
        if(tokens[i]!='/' && tokens[i]!='*'){
            newtokens.push(tokens[i]); i++; continue;
        }
        x=parseFloat(newtokens[i-1]);
        y=parseFloat(tokens[i+1]);
        if(tokens[i]=='*') newtokens[i-1]=x*y;
        if(tokens[i]=='/') newtokens[i-1]=x/y;
        i+=2;
    }
    tokens=newtokens;

    i=0;
    l=tokens.length;
    newtokens=[];
    while(i<l){
        if(tokens[i]!='%'){
            newtokens.push(tokens[i]); i++; continue;
        }
        x=parseFloat(newtokens[i-1]);
        y=parseFloat(tokens[i+1]);
        newtokens[i-1]=x%y;
        i+=2;
    }
    tokens=newtokens;
    
    i=0;
    l=tokens.length;
    newtokens=[];
    while(i<l){
        if(tokens[i]!='+' && tokens[i]!='-'){
            newtokens.push(tokens[i]); i++; continue;
        }
        x=parseFloat(newtokens[i-1]);
        y=parseFloat(tokens[i+1]);
        if(tokens[i]=='+') newtokens[i-1]=x+y;
        if(tokens[i]=='-') newtokens[i-1]=x-y;
        i+=2;
    }
    tokens=newtokens;
    currentBox.value=tokens[0];
    currentBox.style.fontSize="18px";
    pastBox.value=expression;
}
      

      
