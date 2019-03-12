import Store from "./state-management/store";
import ComponentsFactory from "./state-management/components-factory";


export default class AppBuilder {

    root(RootComponent){
        this.RootComponent = RootComponent;
        return this;
    }

    parent(parentNode){
        this.parentNode = parentNode;
        return this;
    }

    reducer(rootReducer){
        this.rootReducer = rootReducer;
        return this;
    }

    build(){
        const store = new Store(this.rootReducer);
        const componentsFactory = new ComponentsFactory(store);
        const root = componentsFactory.create(this.RootComponent);
        root.render();
        root.mount(this.parentNode);
    }
}