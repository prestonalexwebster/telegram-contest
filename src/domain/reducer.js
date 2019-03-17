import * as actionTypes from "./action-types";

const initialState = {
    xRange: [0.75, 1]
};

function getHiddenCharts(charts, shownIndex){
    return charts.map((chart, index) => {
        const isHidden = index !== shownIndex;
        return chart.columns.filter(c => c[0] !== 'x')
            .map(c => c[0])
            .reduce((acc, label) => {
                return {
                    ...acc,
                    [label]: isHidden
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

function visibleChartsCount(hiddenCharts){
    return hiddenCharts.reduce((sum, hiddenLines) => sum+Object.values(hiddenLines).filter(hidden => !hidden).length, 0);
}

export default function reducer(prevState, action) {
    const state = prevState || initialState;
    switch (action.type) {
        case actionTypes.FETCH_CHARTS:
            return {
                ...state,
                charts: action.data,
                hiddenCharts: getHiddenCharts(action.data, 0)
            };
        case actionTypes.SET_X_RANGE:
            return {...state, xRange: action.data};
        case actionTypes.HIDE_CHART:
            return {
                ...state,
                hiddenCharts: (
                    visibleChartsCount(state.hiddenCharts) > 1
                        ?  updateChartsVisibility(state.hiddenCharts, action.data.index, action.data.label, true)
                        : state.hiddenCharts
                )
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