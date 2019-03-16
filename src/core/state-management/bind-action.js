

export const bindAction = (action, dispatch) => {
    if(action.async) {
        return (...args) => action.dispatch(...args).then(data => {
            dispatch({type: action.type, data});
        });
    }
    if(!action.dispatch){
        return () => dispatch({type: action.type});
    }
    return (...args) => dispatch({type: action.type, data: action.dispatch(...args)})
};

