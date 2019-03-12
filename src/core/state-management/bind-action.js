

export const bindAction = (action, dispatch) => {
    if(action.async) {
        return (...args) => action.dispatch(...args).then(data => {
            dispatch({type: action.type, data});
        });
    }
    return (...args) => dispatch({type: action.type, data: action.dispatch(...args)})
};

