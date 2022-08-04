class Calculator{


    //metodo construtor da classe Calculator
    constructor(){
        this.locale = "pt-BR";
        this._btnsCalculator = document.querySelectorAll("[data-value]");
        this._displayEl = document.querySelector(".display");
        this._displayTimeEl = document.querySelector(".time");
        this._displayDateEl = document.querySelector(".date");
        this._newDate;
        this._operation = [];
        this._equalClicked = false;
        this.initialize();
    }


    //metodo inicial da aplicação
    initialize(){
        this.setDateTime();
        
        setInterval(()=>{
            this.setDateTime();
        })
        this.eventsButtons();

        this.setDisplay();
    }


    //adiciona mais de um evento aos botões
    addEventListenerAll(element,events,fn){
        events.split(" ").forEach(event=>{
            element.addEventListener(event,fn);
        })
    }


    //adiciona evento aos botões
    eventsButtons(){
        this._btnsCalculator.forEach(btn=>{
            this.addEventListenerAll(btn,"click drag",()=>{
                let valueButton = btn.dataset.value;
                this.execButton(valueButton);
            })
        })
    }

    clearEntry(){

    }

    clear(){
        this._operation = [];
        this.setDisplay();
    }


    //retorna o ultimo valor inserido na operação
    getLastPositionOperation(){
        return this._operation.at(-1);
    }


    //retorna true se o valor passado for um operador
    isOperator(value){
        return (['+','-','*','/','.','%'].indexOf(value) > -1);
    }

    //altera ou adiciona um valor a ultima operação da calculadora
    setLastPositionOperation(value){
        this._operation[this._operation.length-1]=value;
    }


    //transforma toda a operacao em string e usa o metodo eval para fazer e retornar o calculo
    calc(){
        let operation = this._operation.join("");
        let result = eval(operation);
        console.log(eval(operation));
        return result;
    }


    //altera o valor da operacao com o resultado do calculo e exibe no display
    equalClicked(){
        let result = this.calc();
        this.setResultOperation(result);
        this.setDisplay();
        console.log(this._operation);
    }


    //insere o valor do calculo na array da operação
    setResultOperation(result){
        this._operation = [result];
    }


    //verifica se tem um segundo operador na operacao, se tiver faz o calculo da primeira expressão
    setCalc(){
        if(this._operation.length>3){
            let lastOperation = this._operation.pop();
            this.setResultOperation(this.calc());
            this._operation.push(lastOperation);
            console.log(lastOperation);
        }
        this.setDisplay();
    }


    //verifica se o igual foi clicado e o proximo botão foi um numero, se sim zera a operação
    equalIsClicked(valueButton){
        if(this._equalClicked && !isNaN(valueButton)){
            this.clear();
        }
        this._equalClicked = false;
    }


    //exibe a operacao no display
    setDisplay(){
        
        let lastNumberOperation;
        
        for(let x=this._operation.length-1; x>=0; x--){
            if(!isNaN(this._operation[x])){
                lastNumberOperation = this._operation[x];
                break;
            }
        }

        if(this._operation.length == 0){
            lastNumberOperation = 0;
        }

        this.display = lastNumberOperation;
    }

    //faz a operação da calculadora
    addOperation(valueButton){
        this.equalIsClicked(valueButton);
        if(isNaN(this.getLastPositionOperation())){
            if(!isNaN(valueButton)){
                this._operation.push(valueButton);
            }
            else if(this.isOperator(valueButton)){
                this.setLastPositionOperation(valueButton);
            }
            else{

            }
        }
        else{
            if(this.isOperator(valueButton)){
                this._operation.push(valueButton);
            }
            else{
                let concatNumber = this.getLastPositionOperation().toString() + valueButton.toString();
                this.setLastPositionOperation(parseInt(concatNumber));
            }
        }

        this.setCalc();
        this.setDisplay();
        console.log(this._operation);
    }


    //recebe o botão clicado e executa a funcao correspondente a ele
    execButton(valueButton){

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
                this.addOperation(parseInt(valueButton));
                break;

            case "division":
                this.addOperation("/");
                break;
            
            case "multiplication":
                this.addOperation("*");
                break;
            
            case "subtraction":
                this.addOperation("-");
                break;

            case "addition":
                this.addOperation("+");
                break;

            case "percent":
                this.addOperation("%");
                break;

            case "equal":
                this._equalClicked = true;
                this.equalClicked();
                break;
            
            case "clear_entry":
                this.clearEntry();
                break;

            case "clear":
                this.clear();
                break;
            
            default:
                alert("valor nao encontrado");
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