import {bindAction} from "./bind-action";

export default class Component {

    constructor(createComponent, createChildrenFactory){
        this.createComponent = createComponent;
        this.createChildrenFactory = createChildrenFactory;
    }

    actions = {};

    postConstruct(dispatch, subscribe){
        this.actions = Object.entries(this.actions).map(([name,action]) => [name,bindAction(action,dispatch)])
            .reduce((a, [name,action]) => {
                return {
                    ...a,
                    [name]: action
                }
            }, {});
        if(this.selector){
            subscribe(this.update);
        }
    }

    attributes = {};

    attr(name, value){
        this.attributes[name] = value;
        return this;
    }

    update = state => {
        const attrs = this.selector(state);
        this.attributes = {
            ...this.attributes,
            ...attrs
        };
        this.render();
    };

    mount(nodeElement){
        this.getRef().appendTo(nodeElement);
        if(this.componentDidMount){
            this.componentDidMount();
        }
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