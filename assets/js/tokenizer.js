var Tokenizer = {
    
    s: "",
    tokens: Array(),
    operators: ["(", ")", "*", "/", "^", "+", "-"],
    lvlops: ["sin", "cos", "tan", "log", "ln", "arcsin", "arccos","arctan"],
    tokenize: function(){
        for( var p = 0; p < this.s.length; p++){
            var exp = this.s[p];

            if (this.isWhiteSpace(exp)){
                continue;
            }

            if (this.isDigitOrPoint(exp)){
                var start = p;
                while(this.isDigitOrPoint(this.s[p])){
                    p++;
                }
                if (this.isDigitOrPoint(this.s[p])){
                    p++;
                    if (this.isDigitOrPoint(this.s[p])){
                        while(this.isDigit(this.s[p])){
                            p++;
                        }
                    }else{
                        p--;
                    }
                }
                this.tokens.push(this.s.slice(start,p));
                continue;
            }

            if ( this.isOperator(exp)){
                this.tokens.push(exp);
                continue;
            }

        }
    },

    setString: function(text){
        this.s = text;
    },

    isDigit: function(e){
        var numReg = /[0-9]/i;
        return numReg.test(e);
    },

    isPoint: function(e){
        return e==".";
    },

    isDigitOrPoint: function(e){
        return this.isDigit(e) || this.isPoint(e);
    },

    isWhiteSpace: function (e) {
        return e == " ";
    },

    isOperator: function (e) {
        return this.operators.includes(e);
    }

    

}
