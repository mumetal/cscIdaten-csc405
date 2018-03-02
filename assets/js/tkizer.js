var inputs = Array();

function handleKeyPress(e){
    e.preventDefault();
    var allowed = [40,41,42,43,45,46,47,48,49,50,51,52,53,54,55,56,57,94,126];
    var code = e.keyCode;
    if(allowed.includes(code)){
        pushNum(String.fromCharCode(code));
    }
    if(code == 13){ //Enter Key
        final();
    }
    if (code == 101) { //  e key
        pushNum("e");
    }
}

function final(){
    try {
        cleanTokens();
        var post = infixToPostfix(inputs);
        var final = evalPost(post);
        if (isNaN(final)){
            throw 1;
        }
        inputs = [final];
        update();
    } catch (error) {
        alert(Errors[error]);
        inputs = [];
        update();
    }
    
}

function del(){
    var peek = inputs[inputs.length - 1];
    if (!isUndefined(peek)){
        if(isInputDigit(peek)){
            peek = peek.substring(0, peek.length-1);
            if (peek==""){
                inputs.pop()
            }else{
                inputs.pop();
                inputs.push(peek);
            }
        }else{
            inputs.pop();
        }
    }
    update();
}

window.onkeypress = handleKeyPress;

function pushNum(n) {
    var num = n.toString();
    if(isInputDigit(num)){
        var peek = inputs[inputs.length - 1];
        if(peek == null){
            inputs.push(num);
        }else if (isInputDigit(peek)){
            if( (Tokenizer.isPoint(num) && !peek.includes(".")) || (Tokenizer.isDigit(num)) ){
                inputs.push(inputs.pop().toString() + num);
            }
            
        }else{
            inputs.push(num);
        }
    }else{
        inputs.push(num);
    }

    console.log(inputs);
    update();
}

function cleanTokens(){
    handleConst();
    handleUnary();
    handleFuncs();
}

function handleUnary(){
    var list = Array();
    var poslist = Array();
    for(var i = 0; i < inputs.length; i++){
        if ( inputs[i] == "-" ){
            list.push(i);
        }
        if ( inputs[i] == "+" ){
            poslist.push(i);
        }
    }
    for(var j = 0; j < list.length; j++){
        var index = list[j];
        if ( index == 0 ){
            inputs[index] = "~";
        } else if ( inputs[index-1] != ")" && !isInputDigit(inputs[index-1]) ){
            inputs[index] = "~";
        }
    }
    for(var j = 0; j < poslist.length; j++){
        var index = poslist[j];
        if ( index == 0 ){
            inputs.splice(0,1);
        } else if ( inputs[index-1] != ")" && !isInputDigit(inputs[index-1]) ){
            inputs.splice(index,1);
        }
    }
}

function handleConst(){
    var constants = {
        "PI": Math.PI,
        "e": Math.E
    };
    var constlist = Array();
    for(var i = 0; i < inputs.length; i++){
        if ( inputs[i] in constants ){
            constlist.push(i);
        }
    }
    for(var j = 0; j < constlist.length; j++){
        var index = constlist[j];
        var con = inputs[index];
        if( isInputDigit(inputs[index-1]) || inputs[index-1] == ")"){
            inputs.splice(index,0,"*");
        }
    }
    constlist = Array();
    for(var i = 0; i < inputs.length; i++){
        if ( inputs[i] in constants ){
            constlist.push(i);
        }
    }
    for(var j = 0; j < constlist.length; j++){
        var index = constlist[j];
        var con = inputs[index];
        inputs.splice(index,1,constants[con].toString());
    }
}

function handleFuncs() {
    var funcs = ["asin", "acos", "atan", "sin", "cos", "tan", "log10", "log2" ];
    var funclist = Array();
    for(var i = 0; i < inputs.length; i++){
        if ( funcs.includes(inputs[i]) ){
            funclist.push(i);
        }
    }
    for(var j = 0; j < funclist.length; j++){
        var index = funclist[j];
        if ( index == 0 ){
            
        } else if ( inputs[index-1] == ")" || isInputDigit(inputs[index-1]) ){
            inputs.splice(index,0,"*");
        }
    }

}

function isInputDigit(n){
    var num = String(n);
    for(var i = 0; i < num.length; i++){
        if(!Tokenizer.isDigitOrPoint(num[i])){
            return false;
        }
    }
    return true;
}





var CyberOpera = {
    ")" : {"precedence": -1,    "assoc":"left", "unary": false},

    "^" : {"precedence": 6,    "assoc":"right", "unary": false, "function":function(a,b){ return Math.pow(a,b);} },
    
    "asin" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.asin },
    "acos" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.acos },
    "atan" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.atan },
    "sin" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.sin },
    "cos" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.cos },
    "tan" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.tan },
    "log10" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.log10 },
    "log2" : {"precedence": 5,   "assoc":"right", "unary": true, "function":Math.log2 },
    "~" : {"precedence": 5,    "assoc":"right", "unary": true, "function": function(e){ return 0 - e;} },
     
    

    "/" : {"precedence": 3,    "assoc":"left", "unary": false, "function":function(a,b){ return a/b;}  },
    "*" : {"precedence": 3,    "assoc":"left", "unary": false, "function":function(a,b){ return a*b;}  },


    "-" : {"precedence": 2,    "assoc":"left", "unary": false, "function":function(a,b){ return a - b;}  }, 
    "+" : {"precedence": 2,    "assoc":"left", "unary": false, "function":function(a,b){ return a + b;}  },

   

    "(" : {"precedence": 0,    "assoc":"left", "unary": false},

    "containsKey": function(im){
        return !(this[im] == null);
    }
}




function infixToPostfix(tokens){
    var output = Array(); 
    var opstack = Array();
    for( var i = 0; i < tokens.length;  i++){
        var token = tokens[i];
        if ( isInputDigit(token)){
            output.push(token);
        } else if(token=="("){
            opstack.push(token);
        } else if( token == ")"){
            while( opstack[opstack.length - 1] != "(" ){
                if(!isUndefined(opstack[opstack.length - 1])){
                        output.push(opstack.pop());
                } else{
                    throw 0;
                }
            }
            opstack.pop();
        } else {
            while(true){
                var j = opstack.length - 1;
                if (j != -1){
                    var tokenprecedence = CyberOpera[token].precedence;
                    var topprecedence = CyberOpera[opstack[j]].precedence;
                    var tokenassoc = CyberOpera[token].assoc;
                    if ( (( topprecedence > tokenprecedence )
                        || ((topprecedence == tokenprecedence) && tokenassoc == "left" ))
                        &&
                        (opstack[j] != "(")
                    ){
                        output.push(opstack.pop());
                    }else{
                        break;
                    }
                } else {
                    break;
                }
            }
            opstack.push(token);
        }
    }
    while (opstack.length > 0) {
        if ( opstack[opstack.length - 1] == "("){
            throw 0;
        }
        output.push(opstack.pop());
    }
    return output;
} 

function evalPost(tokens){
    var final = Array();
    for( var i = 0; i < tokens.length; i++ ){
        var token = tokens[i];
        if (isInputDigit(token)){
            final.push(token);
        }else {
            if ( CyberOpera[token].unary ){
                var e = Number(final.pop());
                final.push(CyberOpera[token].function(e).toString());
            }else{
                var b = Number(final.pop());
                var a = Number(final.pop());
                final.push(CyberOpera[token].function(a,b).toString());
            }
        }
    }
    return final[0];
}


function strip(str){
    return str.replace(/,/g, "");
}

function isUndefined(param) {
    return param == undefined;
}

function update(){
    document.getElementById("text").value = strip(inputs.join());
}

var Errors = {
    0 : "Mismatched Parentheses",
    1 : "Syntax error"
}