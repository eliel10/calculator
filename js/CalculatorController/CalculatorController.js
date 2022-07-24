class Calculator{


    //metodo construtor da classe Calculator
    constructor(){
        this.locale = "pt-BR";
        this._btnsCalculator = document.querySelectorAll(".btn");
        this._displayEl = document.querySelector(".display");
        this._displayTimeEl = document.querySelector(".time");
        this._displayDateEl = document.querySelector(".date");
        this._newDate;
        this.initialize();
    }


    //metodo inicial da aplicação
    initialize(){
        this.setDateTime();
        
        setInterval(()=>{
            this.setDateTime();
        })
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
}