import {findInterpolatedIndex, interpolatedSlice, max, min, normalize} from './helpers';
import {axisBoundsSelector, chartPairsSelector} from './lines-selector';
import {createSelector} from "../core/state-management/create-selector";

export const rangesSelector = createSelector(
    state => state.xRange,
    chartPairsSelector,
    axisBoundsSelector,
    (xRange, chartPairs, {xMin, xMax, yMin, yMax}) => {
        if(!xRange || !chartPairs) {
            return {};
        }
        const yRanges = chartPairs
            .filter(({xColumn}) => {
                const xStart = normalize(xColumn[0], xMin, xMax);
                const xEnd = normalize(xColumn[xColumn.length-1], xMin, xMax);
                return !(xStart > xRange[1] || xEnd  < xRange[0]);
            })
            .map(
            ({xColumn, yColumns}) => {
                const indexStart = findInterpolatedIndex(xColumn, xMin + xRange[0] * (xMax - xMin));
                const indexEnd = findInterpolatedIndex(xColumn, xMin + xRange[1] * (xMax - xMin));
                //const yStart = (min(Object.values(yColumns).map(c => min(interpolatedSlice(c, indexStart, indexEnd)))) - yMin) / (yMax - yMin);
                const yEnd = (max(Object.values(yColumns).map(c => max(interpolatedSlice(c, indexStart, indexEnd)))) - yMin) / (yMax - yMin);
                //return [yStart, yEnd];
                return yEnd;
            }
        );

        //const yStart = min(yRanges.map(([start]) => start));
        const yEnd = max(yRanges/*.map(([start, end]) => end)*/);

        return {
            xRange: xRange,
            yRange: [0, yEnd]
        }
    }
);
