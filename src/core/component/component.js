import {bindAction} from "../state-management/bind-action";

export default class Component {

    constructor(createComponent, createChildrenRenderer){
        this.createComponent = createComponent;
        this.createChildrenRenderer = createChildrenRenderer;
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
        //todo: call componentWillUnmount method
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