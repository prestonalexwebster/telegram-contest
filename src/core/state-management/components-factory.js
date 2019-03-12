import {ChildrenRenderer} from '../renderers/children-renderer';


class ChildrenComponentsRenderer {

    constructor(Component, createComponent){
        this.Component = Component;
        this.createComponent = createComponent;
        this.elementsFactory = new ChildrenRenderer(this.factoryMethod);
    }

    factoryMethod = () => {
        return this.createComponent(this.Component);
    };

    render(...args){
        return this.elementsFactory.render(...args);
    }

    //todo: add unmount method

}

export default class ComponentsFactory {

    constructor(store){
        this.store = store;
    }

    createChildrenRenderer = Class => new ChildrenComponentsRenderer(Class, this.create);

    create = (Class) => {
        const component = new Class(this.create, this.createChildrenRenderer);
        component.postConstruct(this.store.dispatch, this.store.subscribe);
        return component;
    };

}

