class Theme{

    constructor(){
        this._iconTheme = document.querySelector(".theme #icon-theme");
        this._container = document.querySelector("#container");
        this._lightThemeIcon = "fa-sun";
        this._darkThemeIcon = "fa-moon";
        this._darkThemeClass = "darkTheme";
        this._lightThemeClass = "light";

        this.initialize();
    }

    initialize(){
        this.eventTheme();
    }


    //verifica qual a classe atual do tema e altera
    setIconTheme(){
        console.log(this._iconTheme);
        if(this.containsClass(this._iconTheme,this._darkThemeIcon) && this.containsClass(this._container,this._darkThemeClass)){
            this.toggleThemeIcon(this._darkThemeIcon,this._lightThemeIcon);
            this.toggleThemeClass(this._darkThemeClass,this._lightThemeClass);
        }
        else{
            this.toggleThemeIcon(this._lightThemeIcon,this._darkThemeIcon);
            this.toggleThemeClass(this._lightThemeClass,this._darkThemeClass);
        }

    }


    containsClass(elemento,classEl){
        return elemento.classList.contains(classEl);
    }


    toggleThemeIcon(classRemove, classAdd){
        this._iconTheme.classList.remove(classRemove);
        this._iconTheme.classList.add(classAdd);
    }


    toggleThemeClass(classRemove, classAdd){
        this._container.classList.remove(classRemove);
        this._container.classList.add(classAdd);
    }


    //adiciona o evento de click no icone de tema
    eventTheme(){
        this._iconTheme.addEventListener("click",()=>{
            this.setIconTheme();
        });
    }
}