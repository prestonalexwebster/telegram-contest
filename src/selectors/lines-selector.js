import {getPath, max, min} from "./helpers";
import {createSelector} from "../core/state-management/create-selector";


export const chartPairsSelector = createSelector(
    state => state.charts,
    state => state.hiddenCharts,
    (charts, hiddenCharts) => {
        if(!charts){
            return [];
        }
        return charts.map((chart,i) => {
            const [xlabel, ...xColumn] = chart.columns.find(c => c[0] === 'x');
            const yColumns = chart.columns.filter(c => c[0] !== 'x')
                .reduce((a, [label, ...column]) => {
                    if(hiddenCharts[i][label]){
                        return a;
                    }
                    return {
                        ...a,
                        [label]: column
                    }
                }, {});
            const names = chart.names;
            const colors = chart.colors;
            return {xColumn, yColumns, names, colors};
        }).filter(({yColumns}) => Object.keys(yColumns).length);
    }
);

export const axisBoundsSelector = createSelector(
    chartPairsSelector,
    chartPairs => {
        if(!chartPairs){
            return {};
        }
        const xMin = min(chartPairs.map(({xColumn})=>min(xColumn)));
        const xMax = max(chartPairs.map(({xColumn})=>max(xColumn)));
        /*const yMin = min(
            chartPairs.map(
                ({yColumns}) => min(
                    Object.entries(yColumns).map(([title, column]) => min(column) )
                )
            )
        );*/
        const yMax = max(
            chartPairs.map(
                ({yColumns}) => max(
                    Object.entries(yColumns).map(([title, column]) => max(column) )
                )
            )
        );
        return {
            xMin,
            xMax,
            yMin: 0,
            yMax
        }
    }
);


export const linesSelector = createSelector(
    chartPairsSelector,
    axisBoundsSelector,
    (chartPairs, {xMin, xMax, yMin, yMax}) => {
        if(!chartPairs) {
            return [];
        }
        return chartPairs.map(
            ({yColumns, xColumn, names, colors}) => {
                return Object.entries(yColumns).map(([yTitle, column]) => {
                    return {
                        color: colors[yTitle],
                        name: names[yTitle],
                        path: getPath(xColumn, column, [xMin, xMax], [yMin, yMax])
                    };
                });
            }
        ).reduce((lines,chartPair) => {
            return [...lines, ...chartPair];
        }, []);
    }
);

