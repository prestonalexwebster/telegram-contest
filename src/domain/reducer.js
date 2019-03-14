import * as actionTypes from "./action-types";
import {detailedChartSize} from '../constants/charts-size';

const initialState = {
    xRange: [550/detailedChartSize, 1]
};

export default function reducer(prevState, action) {
    const state = prevState || initialState;
    switch (action.type) {
        case actionTypes.FETCH_CHARTS:
            return {...state, charts: action.data};
        case actionTypes.SET_X_RANGE:
            return {...state, xRange: action.data};
        default:
            return state;
    }
}