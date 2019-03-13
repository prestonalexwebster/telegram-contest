import * as actionTypes from './action-types';

export const fetchCharts = {
    dispatch: () => import('../../static/chart_data.json').then(d => d.default),
    async: true,
    type: actionTypes.FETCH_CHARTS
};


export const setRange = {
    dispatch: (xRange) => xRange,
    type: actionTypes.SET_X_RANGE
};

