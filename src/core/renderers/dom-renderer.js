const defaultOptions = {
    svg: false
};

export default  class DomRenderer {

    svg = false;

    ref = null;

    tag = null;

    attributes = {};

    styleProps = {};

    listeners = {};

    captureListeners = {};

    childElements = [];

    classList = [];

    textContent = null;

    prevAttributes = {};

    prevStyleProps = {};

    prevListeners = {};

    prevCaptureListeners = {};

    prevChildElements = [];

    prevClassList = [];

    prevTextContent = null;

    constructor(tag, options = defaultOptions) {
        this.tag = tag;
        if (options.svg === true) {
            this.svg = true;
        }
    }

    attr(name, value) {
        this.attributes[name] = value;
        return this;
    }

    style(name, value) {
        this.styleProps[name] = value;
        return this;
    }

    text(textContent){
        this.textContent = textContent;
        return this;
    }

    on(event, callback) {
        this.listeners[event] = callback;
        return this;
    }

    onCapture(event, callback){
        this.captureListeners[event] = callback;
        return this;
    }

    didAttrChanged = ([name, value]) => {
        return this.attributes[name] !== this.prevAttributes[name];
    };

    didStyleChanged = ([name, value]) => {
        return this.styleProps[name] !== this.prevStyleProps[name];
    };

    didListenerChanged = ([name, value]) => {
        return this.listeners[name] !== this.prevListeners[name];
    };

    didCaptureListenerChanged = ([name, value]) => {
        return this.captureListeners[name] !== this.prevCaptureListeners[name];
    };

    updateAttrs = ([name, value]) => {
        if (this.svg) {
            this.ref.setAttributeNS(null, name, value);
        } else {
            this.ref.setAttribute(name, value);
        }
    };

    updateStyle = ([name, value]) => {
        this.ref.style.setProperty(name, value);
    };

    updateListeners = ([name, value]) => {
        if(this.prevListeners[name]){
            this.ref.removeEventListener(name, this.prevListeners[name]);
        }
        if(value){
            this.ref.addEventListener(name, value);
        }
    };

    updateCaptureListeners = ([name, value]) => {
        if(this.prevCaptureListeners[name]){
            this.ref.removeEventListener(name, this.prevCaptureListeners[name], false);
        }
        if(value){
            this.ref.addEventListener(name, value, false);
        }
    };

    createElement(){
        if(this.svg){
            return document.createElementNS('http://www.w3.org/2000/svg', this.tag);
        }else{
            return document.createElement(this.tag);
        }
    }

    updateDom(){
        Object.entries(this.attributes)
            .filter(this.didAttrChanged)
            .forEach(this.updateAttrs);
        Object.entries(this.styleProps)
            .filter(this.didStyleChanged)
            .forEach(this.updateStyle);
        Object.entries(this.listeners)
            .filter(this.didListenerChanged)
            .forEach(this.updateListeners);
        Object.entries(this.captureListeners)
            .filter(this.didCaptureListenerChanged)
            .forEach(this.updateCaptureListeners);
    }

    updateState(){
        this.prevStyleProps = this.styleProps;
        this.prevAttributes = this.attributes;
        this.prevListeners = this.listeners;
        this.prevChildElements = this.childElements;
        this.prevClassList = this.classList;
        this.styleProps = {...this.styleProps};
        this.attributes = {...this.attributes};
        this.listeners = {...this.listeners};
        this.childElements = [...this.childElements];
        this.classList = [...this.classList];
    }

    updateChildren(){
        if(this.prevChildElements.length === this.childElements.length &&
           this.childElements.every((e,i) => this.prevChildElements[i] === e)){
            return;
        }
        this.prevChildElements.filter(e => !this.childElements.includes(e))
            .forEach(e => this.ref.removeChild(e.ref));
        if(!this.childElements.length){
            return;
        }
        const firstElement = this.childElements[0];
        if(firstElement.ref.parentElement !== this.ref){
            this.ref.appendChild(firstElement.ref);
        }
        let currentChild = firstElement.ref;
        for(let i = 1; i < this.childElements.length; ++i){
            const nextChild = this.childElements[i].ref;
            if(nextChild.parentElement !== this.ref){
                this.ref.appendChild(nextChild);
            }
            this.ref.insertBefore(currentChild, nextChild);
            currentChild = nextChild;
        }
    }

    children(childElements=[]){
        this.childElements = childElements;
        return this;
    }

    classes(classList){
        this.classList = classList;
        return this;
    }

    updateClassList(){
        if(this.prevClassList.length !== this.classList.length &&
            this.classList.every((e,i) => this.prevClassList[i] === e)){
            return;
        }
        if(this.svg){
            this.ref.setAttributeNS(null, 'class', this.classList.join(' '));
        }else{
            this.ref.setAttribute('class', this.classList.join(' '));
        }

    }

    updateTextContent(){
        if(this.textContent !== this.prevTextContent){
            this.ref.textContent = this.textContent;
        }
    }

    render() {
        if(!this.ref){
            this.ref = this.createElement();
        }
        this.updateClassList();
        this.updateDom();
        if(this.textContent){
            this.updateTextContent();
        }else{
            this.updateChildren();
        }
        this.updateState();
        return this;
    }

    isAppended(){
        return !!this.ref.parentElement;
    }

    detouch(){
        this.ref.parentElement.removeChild(this.ref);
        //todo: remove all listeners here
    }

    appendTo(domElement){
        domElement.appendChild(this.ref);
        return this;
    }

}