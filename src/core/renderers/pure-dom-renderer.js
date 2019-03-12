
const defaultOptions = {
    svg: false
};


export default class PureDomRenderer {

    svg = false;

    ref = null;

    tag = null;

    constructor(tag, options = defaultOptions) {
        this.tag = tag;
        if (options.svg === true) {
            this.svg = true;
        }
        this.ref = this.createElement();
    }

    attr(name, value) {
        if (this.svg) {
            this.ref.setAttributeNS(null, name, value);
        } else {
            this.ref.setAttribute(name, value);
        }
        return this;
    }

    style(name, value) {
        this.ref.style.setProperty(name, value);
        return this;
    }

    text(textContent){
        this.ref.textContent = textContent;
        return this;
    }

    classes(classList){
        if (this.svg) {
            this.ref.setAttributeNS(null,'class', classList.join(" "));
        } else {
            this.ref.setAttribute('class', classList.join(" "));
        }
        return this;
    }

    on(event, callback) {
        this.ref.addEventListener(event, callback);
        return this;
    }

    off(event, callback){
        this.ref.removeEventListener(event, callback);
        return this;
    }

    onCapture(event, callback){
        this.ref.addEventListener(event, callback, false);
        return this;
    }

    offCapture(event, callback){
        this.ref.removeEventListener(event, callback, false);
        return this;
    }



    createElement(){
        if(this.svg){
            return document.createElementNS('http://www.w3.org/2000/svg', this.tag);
        }else{
            return document.createElement(this.tag);
        }
    }

    isAppended(){
        return !!this.ref.parentElement;
    }

    detouch(){
        this.ref.parentElement.removeChild(this.ref);
    }

    appendTo(domElement){
        domElement.appendChild(this.ref);
        return this;
    }

}