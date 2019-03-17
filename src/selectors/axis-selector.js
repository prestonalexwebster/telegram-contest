import {createSelector} from "../core/state-management/create-selector";
import {axisBoundsSelector} from './lines-selector';

const ticksNumber = 7;

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

function ticksRange(start, length, capacity, mapper){
    return new Array(length).fill(0).map( (_, i) => {
        const tickIndex = i + start;
        return mapper(tickIndex/(capacity-1));
    });
}

export const ticksSelector = createSelector(
    state => state.xRange,
    axisBoundsSelector,
    (xRange, {xMin, xMax}) => {
        if (!xRange) return [];
        const size = xRange[1] - xRange[0];
        const log2Scale = invertedNaturalLog2(size);
        const totalTicks = (ticksNumber - 1) * Math.pow(2, log2Scale) + 1;
        const firstTickIndex = findTickBefore(xRange[0], totalTicks);
        const xTicks = ticksRange(firstTickIndex, ticksNumber, totalTicks, (tickX) => {
            const time = parseInt(tickX*(xMax-xMin)+xMin);
            return {
                x: tickX,
                timeStamp: time,
                date: toDate(time)
            };
        });
        return {
            xTicks
        };
    }
);