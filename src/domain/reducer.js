import * as actionTypes from "./action-types";
import {detailedChartSize} from '../constants/charts-size';

const initialState = {
    xRange: [550/detailedChartSize, 1]
};

function getHiddenCharts(charts){
    return charts.map(chart => {
        return chart.columns.filter(c => c[0] !== 'x')
            .map(c => c[0])
            .reduce((acc, label) => {
                return {
                    ...acc,
                    [label]: false
                }
            }, {});
    })
}

function updateChartsVisibility(hiddenCharts, index, label, value){
    return hiddenCharts.map((hiddenLines, i) => {
        if(index === i){
            return {
                ...hiddenLines,
                [label]: value
            };
        }
        return hiddenLines;
    })
}

export default function reducer(prevState, action) {
    const state = prevState || initialState;
    switch (action.type) {
        case actionTypes.FETCH_CHARTS:
            return {
                ...state,
                charts: action.data,
                hiddenCharts: getHiddenCharts(action.data)
            };
        case actionTypes.SET_X_RANGE:
            return {...state, xRange: action.data};
        case actionTypes.HIDE_CHART:
            return {
                ...state,
                hiddenCharts: updateChartsVisibility(state.hiddenCharts, action.data.index, action.data.label, true)
            };
        case actionTypes.SHOW_CHART:
            return {
                ...state,
                hiddenCharts: updateChartsVisibility(state.hiddenCharts, action.data.index, action.data.label, false)
            };
        default:
            return state;
    }
}