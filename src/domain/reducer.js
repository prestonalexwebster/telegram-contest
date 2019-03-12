import {FETCH_CHARTS} from "./action-types";

const initialState = {

};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case FETCH_CHARTS:
            return {...state, charts: action.data};
        default:
            return state;
    }
}