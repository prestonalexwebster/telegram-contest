import {FETCH_CHARTS} from 'action-types';

export const fetchCharts = {
    dispatch: () => fetch('/chart_data.json').then(d => d.json()),
    async: true,
    type: FETCH_CHARTS
};