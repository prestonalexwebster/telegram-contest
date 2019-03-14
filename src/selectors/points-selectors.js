import {detailedChartSize} from "../constants/charts-size";

const min  = c => c.reduce((min,v) => Math.min(v,min));
const max = c => c.reduce((max,v) => Math.max(v,max));

const findNearestIndex = (c, x) => c.reduce((index,d,i)=> Math.abs(c[index] - x) > Math.abs(d - x) ? i : index, 0);

const findInterpolatedIndex = (list,x) => {
    const i = findNearestIndex(list,x);
    if(i === 0 && list[i] > x || i === list.length-1 && list[i] < x){
        return i;
    }
    if(list[i] < x){
        const frac = (x-list[i])/(list[i+1]-list[i]);
        return i+frac;
    }else if(list[i] > x){
        const frac = (list[i]-x)/(list[i]-list[i-1]);
        return i-frac;
    }
    return i;
};

const interpolatedSlice = (list, interpolatedStart, interpolatedEnd) => {
    let leftBound = Math.max(0,Math.floor(interpolatedStart));
    let rightBound = Math.min(list.length-1, Math.ceil(interpolatedEnd));
    if(rightBound-leftBound < 2 && leftBound > 0){
        leftBound--;
    }else if(rightBound-leftBound < 2 && rightBound < list.length -1){
        rightBound++;
    }
    const leftValue = list[leftBound] + (interpolatedStart-leftBound)*(list[leftBound+1]-list[leftBound]);
    const rightValue = list[rightBound] - (rightBound - interpolatedEnd)*(list[rightBound]-list[rightBound-1]);
    return [leftValue, ...list.slice(leftBound+1, rightBound), rightValue];
};

const normalize = (value, vMin, vMax) => {
    return (value - vMin)/(vMax-vMin);
};

const getPath = (xs, ys, [xMin, xMax], [yMin, yMax]) => {
    const [start, ...restPoints] =  xs.map((x,index) => {
        return {
            x: normalize(x, xMin, xMax),
            y: 1-normalize(ys[index], yMin, yMax)
        };
    });
    return `M${start.x} ${start.y} ${restPoints.map(({x,y}) => `L${x} ${y}`).join(' ')}`;
};


export const linesSelector = state => {
    if (!state.charts) return null;
    const chart = state.charts[0];
    const [xlabel, ...xColumn] = chart.columns.find(c => c[0] === 'x');
    const yColumns = chart.columns.filter(c => c[0] !== 'x')
        .reduce((a, [label, ...column]) => {
            return {
                ...a,
                [label]: column
            }
        }, {});
    const xMin = min(xColumn);
    const xMax = max(xColumn);
    const yMin = min(
        Object.entries(yColumns).map(([title, column]) => min(column) )
    );
    const yMax = max(
        Object.entries(yColumns).map(([title, column]) => max(column) )
    );
    return Object.entries(yColumns).map(([yTitle, column]) => {
        return {
            color: chart.colors[yTitle],
            name: chart.names[yTitle],
            path: getPath(xColumn, column, [xMin, xMax], [yMin, yMax])
        };
    });
};


export const seekerSelector = state => {
    if(!state.xRange) return {};
    return {
        seekerLeft: state.xRange[0]*detailedChartSize,
        seekerWidth: (state.xRange[1]-state.xRange[0])*detailedChartSize
    }
};

export const rangesSelector = state => {
    if(!state.xRange || !state.charts) return {};
    const chart = state.charts[0];
    const [xlabel, ...xColumn] = chart.columns.find(c => c[0] === 'x');
    const yColumns = chart.columns.filter(c => c[0] !== 'x')
        .reduce((a, [label, ...column]) => {
            return {
                ...a,
                [label]: column
            }
        }, {});
    const xMin = min(xColumn);
    const xMax = max(xColumn);
    const yMin = min(
        Object.entries(yColumns).map(([title, column]) => min(column) )
    );
    const yMax = max(
        Object.entries(yColumns).map(([title, column]) => max(column) )
    );
    const indexStart = findInterpolatedIndex(xColumn, xMin+state.xRange[0]*(xMax-xMin));
    const indexEnd = findInterpolatedIndex(xColumn, xMin+state.xRange[1]*(xMax-xMin));
    const yStart = (min(Object.values(yColumns).map(c => min(interpolatedSlice(c,indexStart, indexEnd))))-yMin)/(yMax-yMin);
    const yEnd = (max(Object.values(yColumns).map(c => max(interpolatedSlice(c, indexStart, indexEnd))))-yMin)/(yMax-yMin);

    return {
        xRange: state.xRange,
        yRange: [yStart, yEnd]
    }
};