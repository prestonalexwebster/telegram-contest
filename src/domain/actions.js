import * as actionTypes from 'action-types';

export const fetchCharts = {
    dispatch: () => fetch('/chart_data.json').then(d => d.json()),
    async: true,
    type: actionTypes.FETCH_CHARTS
};

export const setRange = {
    dispatch: (xRange) => xRange,
    type: actionTypes.SET_X_RANGE
};

