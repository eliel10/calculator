class Calculator{


    constructor(){
        this.locale = "pt-BR";
        this._btnsCalculator = document.querySelectorAll("[data-value]");
        this._displayEl = document.querySelector(".display");
        this._historyEl = document.querySelector(".history");
        this._displayTimeEl = document.querySelector(".time");
        this._displayDateEl = document.querySelector(".date");
        this._newDate;
        this._operation = [];
        this._history = [];
        this._equalClicked = false;
        this._lastNumber = "";
        this._lastOperator = "";
        this.initialize();
    }


    initialize(){
        
        this.copyToClipboard();
        this.pasteFromClipboard();
        this.setDateTime();
        this.eventsButtons();
        
        setInterval(()=>{

            this.setDateTime();

        })


        this.setDisplay();
    }


    //copia texto para área de transferência
    copyToClipboard(){

        let textSelected = this.display;
        
        navigator.clipboard.writeText(textSelected);
        
    }


    //cola texto da área de trasferência para o display
    pasteFromClipboard(){

        document.addEventListener("paste", async e=>{
            
            let textPaste = navigator.clipboard.readText();

            textPaste = await textPaste;
            
            let indiceDot = textPaste.indexOf(".");

            let indiceComma = textPaste.indexOf(",");

            let textPasteList = textPaste.split("");

            textPasteList[indiceDot] = "";

            textPasteList[indiceComma] = ".";

            textPaste = textPasteList.join("");

            this.addOperation(textPaste);

            this.setDisplay();

        })

    }


    //coloca background no botão da calculadora quando pressionado a tecla do teclado
    animationButtonClicked(btnKeyboard){
        
        this._btnsCalculator.forEach(btnCalc=>{
            
            if(btnCalc.dataset.value==btnKeyboard || btnCalc.textContent==btnKeyboard){
                
                btnCalc.classList.toggle("btnClickedKeyboard");

                setTimeout(()=>btnCalc.classList.toggle("btnClickedKeyboard"),100);

            }

        })

    }


    //adiciona mais de um evento aos botões
    addEventListenerAll(element,events,fn){

        events.split(" ").forEach(event=>{

            element.addEventListener(event,fn);

        })

    }


    //passa os eventos que os botões irão receber
    eventsButtons(){

        this._btnsCalculator.forEach(btn=>{

            this.addEventListenerAll(btn,"mousedown drag",()=>{

                let valueButton = btn.dataset.value;

                this.execButton(valueButton);

            })

        })

        document.addEventListener("keydown",tecla=>{

            this.animationButtonClicked(tecla.key);
            
            let copy = tecla.ctrlKey ? true : false;

            this.execButton(tecla.key,copy);

        })

    }


    //limpa a última entrada da operação
    clearEntry(){

        this._operation.pop();
        this._history.pop();
        this.setDisplay();
        this.setHistory();

    }


    //limpa toda a operação
    clear(){

        this._operation = [];
        this._history = [];
        this._lastNumber = "";
        this._lastOperator = "";
        this._equalClicked = false;
        this.setHistory();
        this.setDisplay();

    }


    //exclui o último número digitado
    removeLastNumber(){

        let lastNumberOperation = this.getLastPosition();
        let lastNumberHistory = this.getLastPosition(false);

        if(typeof lastNumberOperation == "string" && !isNaN(lastNumberOperation)){

            let lastNumberOperationList = lastNumberOperation.split("");
            let lastNumberHistoryList = lastNumberHistory.split("");

            lastNumberOperationList.pop();
            lastNumberHistoryList.pop();

            if(lastNumberOperationList.length == 0){
                this._operation.pop();

                this._history.pop();

                this.setDisplay(true);

                return;
            }

            this.setLastPosition(lastNumberOperationList.join(""));
            this.setLastPosition(lastNumberHistoryList.join(""),false);
            this.setDisplay();
            
        }

    }

    //retorna o ultimo valor inserido na operação ou no histórico
    getLastPosition(operation = true){

        if(operation){
            return this._operation.at(-1);
        }
        else{
            return this._history.at(-1);
        }

    }


    //retorna true se o valor passado for um operador
    isOperator(value){
        return (['+','-','*','/','.','%'].indexOf(value) > -1);
    }

    //altera ou adiciona um valor a última operação ou histórico da calculadora
    setLastPosition(value,operation = true){
        if(operation){
            this._operation[this._operation.length-1]=value;
        }
        else{
            this._history[this._history.length-1]=value;
        }
    }


    //verifica se o último número da operação ultrapassa 10 digitos, ou igual
    isLargerLastNumberOperation(){
        let lastNumberOperation = this.getLastPosition();

        if(lastNumberOperation && lastNumberOperation.length>=10) return true;
    }


    //transforma toda a operacao em string e usa o metodo eval para fazer e retornar o calculo
    calc(){

        let operation = this._operation.join("");

        let result = "";

        try{
            result = eval(operation).toString();
            result = this.resultOperationDecimals(result);
        }
        catch(e){

            setTimeout(()=>{

                this.display = "Error";
                
            },1)
        }
        return result;
    }


    //retorna duas casas decimais do resultado
    resultOperationDecimals(result){

        let newResult = this.hasDot(result) ? parseFloat(result).toFixed(2).toString() : result;

        return newResult;

    }

    //altera o valor da operacao com o resultado do calculo e exibe no display
    equalClicked(){
        if(this._operation.length == 0) return;

        if(this._operation.length < 3){

            let firstNumber = this._operation[0];

            this._operation = [firstNumber,this._lastOperator,this._lastNumber];

            this._history = [firstNumber,this._lastOperator,this._lastNumber];

        }

        let result = this.calc();

        this.setResultOperation(result);

        this.setDisplay();

        this.setHistory();

        this._equalClicked = true;
    }


    //insere o valor do calculo na array da operação
    setResultOperation(result,lastOperation){

        result=this.resultOperationDecimals(result);

        let newResult = lastOperation ? [result,lastOperation] : [result];

        this._operation = newResult;
        
    }


    //verifica se tem um segundo operador na operacao, se tiver faz o calculo da primeira expressão
    setCalc(){

        this._lastOperator = this.getLastItem();
        
        if(this._operation.length>3){

            let lastOperation = this._operation.pop();
            
            this._lastNumber = this.calc();

            let result = parseFloat(this.calc());

            if(lastOperation=="%"){
                result /= 100;

                this.setResultOperation(result.toString());

            }
            else{

                this.setResultOperation(result.toString(),lastOperation);

            }
        }
        else if(this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);

        }
        
        this.setDisplay();
    }


    //verifica se o igual foi clicado e o proximo botão clicado foi um numero, se sim, zera a operação
    equalIsClicked(valueButton){

        if(this._equalClicked && !isNaN(valueButton) && this._operation.length == 1){

            this.clear();

        }
    }


    //retorna um operador case seja passado um parametro true, ou não seja passado, ou numero caso seja false
    getLastItem(isOperator = true){
        let lastItem;
        
        for(let x=this._operation.length-1; x>=0; x--){

            if(this.isOperator(this._operation[x]) == isOperator){
                lastItem = this._operation[x];
                break;
            }

        }

        return lastItem;
    }


    //insere mascara para casas decimais
    setMaskDisplay(operation){

        let mask = /(\d)(?=(\d{3})+(?!\d))/g;
        
        let operationValue = operation.toString();
        
        if(operationValue.indexOf(",")>-1){

            mask = /(\d)(?=(\d{3})+(?!\d),)/g;

        }

        return operationValue.replace(mask,"$1.");
    }


    //exibe a operacao no display
    setDisplay(zero){
        
        let lastNumberOperation = this.getLastItem(false);
        
        let indiceDot;

        indiceDot = lastNumberOperation != undefined ? lastNumberOperation.indexOf(".") : -1;

        if(indiceDot>-1){

            let lastNumberOperationList = lastNumberOperation.split("");

            lastNumberOperationList[indiceDot] = ",";

            lastNumberOperation = lastNumberOperationList.join("");
        }

        if(this._operation.length == 0 || zero){
            lastNumberOperation = 0;
        }

        this.display = this.setMaskDisplay(lastNumberOperation);
    }


    //exibe o historico da operação no display
    setHistory(){
        let historyValue = this._history.length == 0 ? "" : this._history.join(" ");

        this.history = historyValue;
    }



    //concatena os numeros digitados na calculadora
    concatNumberOperation(valueButton){
        let concatNumber = this.getLastPosition() + valueButton;

        this.setLastPosition((concatNumber));

        this.setLastPosition((concatNumber),false);
    }


    //adiciona os valores e operadores na operação da calculadora
    addOperation(valueButton){

        this.equalIsClicked(valueButton);

        if(isNaN(this.getLastPosition())){
            
            if(!isNaN(valueButton)){
                
                if(valueButton == 0){
                    
                    return;
                }

                this.insertValueOperation(valueButton);
            }
            else if(this.isOperator(valueButton)){

                this.setLastOpetator(valueButton);

            }
        }
        else{
            if(this.isOperator(valueButton)){
                
                this.insertValueOperation(valueButton);
                this.setHistory();

            }
            else{

                if(this.isLargerLastNumberOperation()) return;
                this.concatNumberOperation(valueButton);

            }
        }

        this.setCalc();
        this.setDisplay();
    }


    //altera o operador na última posição da operação e no histórico
    setLastOpetator(valueButton){

        this.setLastPosition(valueButton);
        this.setLastPosition(valueButton,false);
        this.setHistory();

    }

    
    //adiciona o valor na operação e no histórico
    insertValueOperation(valueButton){

        this._operation.push(valueButton);
        this._history.push(valueButton);

    }


    //adiciona o ponto na operação
    addDot(){
        let lastOperation = this.getLastPosition();
    
        if(this.isOperator(lastOperation) || !lastOperation){
            
            this._operation.push("0.");
            this._history.push("0.");
            
        }
        else{
            
            if(typeof(lastOperation) === "string" && this.hasDot(lastOperation)){

                return;

            }
            
            this.setLastPosition(lastOperation.toString() + ".");
        }

        this.setDisplay();
    }


    //verifica se a expressão tem "."
    hasDot(value){

        return value.indexOf(".") > -1;

    }


    //recebe o botão clicado(digital ou do teclado) e executa a funcao correspondente a ele
    execButton(valueButton,copy){
        
        switch(valueButton){

            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":
            case "/":
            case "*":
            case "-":
            case "+":
            case "%":
                this.addOperation(valueButton);
                break;

            case ",":
                this.addDot();
                break;

            case "Enter":
            case "=":
                this.equalClicked();
                break;
            
            case "Delete":
                this.clearEntry();
                break;

            case "Escape":
                this.clear();
                break;

            case "Backspace":
                this.removeLastNumber();
                break;

            case "c":
                if(copy){
                    this.copyToClipboard();
                }
                break;
        }
    }


    //adiciona a data e hora atual na calculadora
    setDateTime(){

        this.date = this.newDate.toLocaleDateString(this.locale,{day:"2-digit",month:"long",year:"numeric"});
        this.time = this.newDate.toLocaleTimeString(this.locale);

    }


    //getters e setters das propriedades da classe Calculator
    get display(){
        return this._displayEl.innerHTML;
    }

    set display(value){
        this._displayEl.innerHTML = value;
    }

    get history(){
        return this._historyEl.innerHTML;
    }

    set history(value){
        this._historyEl.innerHTML = value;
    }

    get time(){
        return this._displayTimeEl.innerHTML;
    }

    set time(value){
        this._displayTimeEl.innerHTML = value;
    }

    get date(){
        return this._displayDateEl.innerHTML;
    }

    set date(value){
        this._displayDateEl.innerHTML = value;
    }

    get newDate(){
        return new Date();
    }

    set newDate(value){
        this._newDate = value;
    }

    get operation(){
        return this._operation;
    }

    set operation(value){
        this._operation = value;
    }
}