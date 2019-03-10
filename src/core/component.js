

export default class Component {

    attributes = {};

    attr(name, value){
        this.attributes[name] = value;
        return this;
    }

    mount(nodeElement){
        this.getRef().appendTo(nodeElement);
    }

    unmount(){
        this.getRef().detouch();
    }

    /**
     * @returns nodeElement
     */
    getRef(){
        throw new Error('This method is to override.');
    }

    /**
     * @returns DomRenderer
     */
    render(){
        throw new Error('This method is to override.');
    }
}