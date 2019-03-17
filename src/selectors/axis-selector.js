import {createSelector} from "../core/state-management/create-selector";
import {axisBoundsSelector} from './lines-selector';
import {rangesSelector} from "./ranges-selector";

const xTicksNumber = 7;
const yTicksNumber = 5;

const invertedNaturalLog2 = number => {
    let current = 0;
    let pow2 = 1;
    while (number <= 1/pow2) {
        current++;
        pow2 *= 2;
    }
    return current - 1;
};

const monthes = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

function getMonthName(date){
    return monthes[date.getMonth()];
}

function toDate(timeStamp){
    const date = new Date(timeStamp);
    return `${getMonthName(date)} ${date.getDate()}`;
}

function findTickBefore(value, ticksCount) {
    return Math.floor(value * ticksCount);
}

function ticksXRange(start, length, capacity, mapper){
    return new Array(length).fill(0).map( (_, i) => {
        const tickIndex = i + start;
        return mapper(tickIndex/(capacity-1));
    });
}

function findYAxisTop(yTop, yMax){
    let yAxisTop = yMax*(yTicksNumber/(yTicksNumber+1));
    while(yAxisTop > 1 && yAxisTop > yTop){
        yAxisTop *= yTicksNumber/(yTicksNumber+1);
    }
    return yAxisTop;
}

function ticksYRange(yTicksTop, yMax, yRange){
    return new Array(yTicksNumber).fill(0).map((_,i)=>{
        const value = yTicksTop*((i+1)/(yTicksNumber+1));
        return {
            value: parseInt(value),
            y: value/yRange[1]/yMax
        }
    });
}

export const ticksSelector = createSelector(
    rangesSelector,
    axisBoundsSelector,
    ({xRange,yRange}, {xMin, xMax, yMax}) => {
        if (!xRange) return [];
        const size = xRange[1] - xRange[0];
        const log2Scale = invertedNaturalLog2(size);
        const totalTicks = (xTicksNumber - 1) * Math.pow(2, log2Scale) + 1;
        const firstTickIndex = findTickBefore(xRange[0], totalTicks);
        const xTicks = ticksXRange(firstTickIndex, xTicksNumber, totalTicks, (tickX) => {
            const time = parseInt(tickX*(xMax-xMin)+xMin);
            return {
                x: tickX,
                timeStamp: time,
                date: toDate(time)
            };
        });

        const yTop = yRange[1]*yMax;
        const yAxisTop = findYAxisTop(yTop, yMax);
        const yTicks = ticksYRange(yAxisTop, yMax, yRange);
        return {
            xTicks,
            yTicks
        };
    }
);