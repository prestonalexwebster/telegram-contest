

export const bindAction = (action, dispatch) => {
    if(action.async) {
        return (...args) => action.dispatch(...args).then(data => {
            dispatch({type, data});
        });
    }
    return (...args) => dispatch({type, data: action.dispatch(...args)})
};

