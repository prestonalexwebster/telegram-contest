import {createSelector} from "../core/state-management/create-selector";
import {axisBoundsSelector, chartPairsSelector} from "./lines-selector";
import {findNearestIndex, min, max} from "./helpers";
import {rangesSelector} from "./ranges-selector";

export const groupedPointsSelector = createSelector(
    rangesSelector,
    chartPairsSelector,
    axisBoundsSelector,
    ({xRange, yRange}, chartPairs, {xMin, xMax, yMin, yMax}) => {
        if(!xRange) return [];
        const chartPoints = {};
        const topY = yRange[1]*yMax;
        const chartBounds = chartPairs.map(({xColumn}) => {
            const startIndex = findNearestIndex(xColumn,xMin+xRange[0]*(xMax-xMin));
            const endIndex = findNearestIndex(xColumn, xMin+xRange[1]*(xMax-xMin));
            const lowerX = xColumn[startIndex];
            const topX = xColumn[endIndex];
            return [lowerX, topX];
        });
        const lowerX = min(chartBounds.map(c => c[0]));
        const topX = max(chartBounds.map(c=>c[1]));
        chartPairs.forEach( ({xColumn, yColumns, colors}) => {
            const startIndex = findNearestIndex(xColumn,xMin+xRange[0]*(xMax-xMin));
            const endIndex = findNearestIndex(xColumn,xMin+xRange[1]*(xMax-xMin));
            for(let i = startIndex; i <= endIndex; ++i){
                const x = xColumn[i];
                if(!chartPoints[x]){
                    chartPoints[x] = [];
                }
                Object.entries(yColumns).forEach(([label,column]) => {
                    chartPoints[x].push({
                        x: (x-lowerX)/(topX-lowerX),
                        y: column[i]/topY,
                        color: colors[label]
                    });
                });
            }
        });
        const sortedPoints = Object.entries(chartPoints)
            .sort(([x1],[x2]) => x1-x2)
            .map(([x, points]) => ({x: points[0].x,points}));
        for(let i = 0; i < sortedPoints.length; ++i){
            if(i === 0){
                sortedPoints[i].width = (sortedPoints[i+1].x-sortedPoints[i].x)/2;
                sortedPoints[i].rectX = 0;
            }else if(i === sortedPoints.length - 1){
                sortedPoints[i].width = (sortedPoints[i].x-sortedPoints[i-1].x)/2;
                sortedPoints[i].rectX = (sortedPoints[i].x+sortedPoints[i-1].x)/2;
            } else {
                sortedPoints[i].width = (sortedPoints[i].x-sortedPoints[i-1].x)/2 + (sortedPoints[i+1].x-sortedPoints[i].x)/2;
                sortedPoints[i].rectX = (sortedPoints[i].x+sortedPoints[i-1].x)/2;
            }
        }
        return sortedPoints;
    }
);