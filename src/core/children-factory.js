import DomRenderer from './dom-renderer';
import PureDomRenderer from './pure-dom-renderer';

export class ChildrenFactory {

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

export class ChildrenTagsFactory {

    constructor(tag, {pure, ...options}){
        this.tag = tag;
        this.options = options;
        this.elementsFactory = new ChildrenFactory(pure ? this.pureFactoryMethod : this.factoryMethod);
    }

    pureFactoryMethod = () => {
        return new PureDomRenderer(this.tag, this.options);
    };

    factoryMethod = () => {
        return new DomRenderer(this.tag, this.options);
    };

    render(...args){
        return this.elementsFactory.render(...args);
    }

}