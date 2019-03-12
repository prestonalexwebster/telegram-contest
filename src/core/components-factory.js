import {ChildrenFactory} from './children-factory';


class ChildrenComponentsFactory {

    constructor(Component, createComponent){
        this.Component = Component;
        this.createComponent = createComponent;
        this.elementsFactory = new ChildrenFactory(this.factoryMethod);
    }

    factoryMethod = () => {
        return this.createComponent(this.Component);
    };

    render(...args){
        return this.elementsFactory.render(...args);
    }

}

export default class ComponentsFactory {

    constructor(store){
        this.store = store;
    }

    createChildrenFactory = Class => new ChildrenComponentsFactory(Class, this.create);

    create = (Class) => {
        const component = new Class(this.create, this.createChildrenFactory);
        component.postConstruct(this.store.dispatch, this.store.subscribe);
        return component;
    };

}

