import * as actionTypes from "./action-types";

const initialState = {

};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_CHARTS:
            return {...state, charts: action.data};
        case actionTypes.SET_X_RANGE:
            return {...state, xRange: action.data};
        default:
            return state;
    }
}