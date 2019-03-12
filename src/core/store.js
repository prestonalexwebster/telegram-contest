
class DataStorage {

    state = null;

    listeners = new Set();

    subscribe(listener){
        this.listeners.add(listener);
    }

    unsubscribe(listener){
        this.listeners.delete(listener);
    }

    getState(){
        return this.state;
    }

    setState(updater){
        this.state = updater(this.state);
        [...this.listeners].forEach(f => f(this.state));
    }

}

export default class Store {

    constructor(reducer){
        this.reducer = reducer;
    }

    dataStorage = new DataStorage();

    dispatch = (action) => {
        this.dataStorage.setState(state => this.reducer(state,action));
    };

    subscribe = (listener) => {
        this.dataStorage.subscribe(listener);
    };

    unsubscribe = (listener) => {
        this.dataStorage.unsubscribe(listener);
    };

}

