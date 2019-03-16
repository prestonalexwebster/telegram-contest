export const min = c => c.reduce((min, v) => Math.min(v, min));

export const max = c => c.reduce((max, v) => Math.max(v, max));

export const normalize = (value, vMin, vMax) => {
    return (value - vMin) / (vMax - vMin);
};

export const getPath = (xs, ys, [xMin, xMax], [yMin, yMax]) => {
    const [start, ...restPoints] = xs.map((x, index) => {
        return {
            x: normalize(x, xMin, xMax),
            y: 1 - normalize(ys[index], yMin, yMax)
        };
    });
    return `M${start.x} ${start.y} ${restPoints.map(({x, y}) => `L${x} ${y}`).join(' ')}`;
};

const findNearestIndex = (c, x) => c.reduce((index, d, i) => Math.abs(c[index] - x) > Math.abs(d - x) ? i : index, 0);

export const findInterpolatedIndex = (list, x) => {
    const i = findNearestIndex(list, x);
    if (i === 0 && list[i] > x || i === list.length - 1 && list[i] < x) {
        return i;
    }
    if (list[i] < x) {
        const frac = (x - list[i]) / (list[i + 1] - list[i]);
        return i + frac;
    } else if (list[i] > x) {
        const frac = (list[i] - x) / (list[i] - list[i - 1]);
        return i - frac;
    }
    return i;
};

export const interpolatedSlice = (list, interpolatedStart, interpolatedEnd) => {
    let leftBound = Math.max(0, Math.floor(interpolatedStart));
    let rightBound = Math.min(list.length - 1, Math.ceil(interpolatedEnd));
    if (rightBound - leftBound < 2 && leftBound > 0) {
        leftBound--;
    } else if (rightBound - leftBound < 2 && rightBound < list.length - 1) {
        rightBound++;
    }
    const leftValue = list[leftBound] + (interpolatedStart - leftBound) * (list[leftBound + 1] - list[leftBound]);
    const rightValue = list[rightBound] - (rightBound - interpolatedEnd) * (list[rightBound] - list[rightBound - 1]);
    return [leftValue, ...list.slice(leftBound + 1, rightBound), rightValue];
};