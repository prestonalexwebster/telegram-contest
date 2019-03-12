import Store from "./state-management/store";
import ComponentsFactory from "./state-management/components-factory";


export default class AppBuilder {

    root(RootComponent){
        this.RootComponent = RootComponent;
    }

    parent(parentNode){
        this.parentNode = parentNode;
    }

    reducer(rootReducer){
        this.rootReducer = rootReducer;
    }

    build(){
        const store = new Store(this.rootReducer);
        const componentsFactory = new ComponentsFactory(store);
        const root = componentsFactory.create(this.RootComponent);
        root.render();
        root.mount(this.parentNode);
    }
}