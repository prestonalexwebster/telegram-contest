import DomRenderer from './dom-renderer';

class ElementsFactory {

    cache = new Map();

    constructor(factoryMethod){
        this.factoryMethod = factoryMethod;
    }

    getByKey(key){
        if(this.cache.has(key)){
            return this.cache.get(key);
        }else{
            const element = this.factoryMethod();
            this.cache.set(key, element);
            return element;
        }
    }

    render(data, keyExtractor, renderMethod){
        const keys = data.map(keyExtractor);
        [...this.cache].filter(([key, value]) => !keys.includes(key))
            .forEach(([key,value]) => this.cache.delete(key));
        return keys.map((key, index) => renderMethod(data[index], index, this.getByKey(key)));
    }
}

export class TagsFactory {

    constructor(tag, options){
        this.tag = tag;
        this.options = options;
        this.elementsFactory = new ElementsFactory(this.factoryMethod);
    }

    factoryMethod = () => {
        return new DomRenderer(this.tag, this.options);
    };

    render(...args){
        return this.elementsFactory.render(...args);
    }

}

export class ComponentsFactory {

    constructor(Component){
        this.Component = Component;
        this.elementsFactory = new ElementsFactory(this.factoryMethod);
    }

    factoryMethod = () => {
        return new this.Component();
    };

    render(...args){
        return this.elementsFactory.render(...args);
    }

}