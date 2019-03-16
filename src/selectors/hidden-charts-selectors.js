import {createSelector} from "../core/state-management/create-selector";


export const togglersStateSelector = createSelector(
    state => state.hiddenCharts,
    state => state.charts,
    (hiddenCharts, charts) => {
        if (!charts) {
            return [];
        }
        return hiddenCharts.map((hiddenLines, index) => {
            return Object.entries(hiddenLines).map(([label, hidden]) => {
                return {
                    visible: !hidden,
                    id: `${index}-${label}`,
                    color: charts[index].colors[label],
                    name: `${charts[index].names[label]}`,
                    index,
                    label
                };
            });
        }).reduce((acc, lines) => {
            return [...acc, ...lines];
        }, []);
    }
);