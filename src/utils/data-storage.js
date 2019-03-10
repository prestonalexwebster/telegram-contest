

export default class DataStorage {

    state = {};

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

    setState(updator){
        this.state = updator(this.state);
        [...this.listeners].forEach(f => f(this.state));
    }

}