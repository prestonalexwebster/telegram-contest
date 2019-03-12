const min  = c => c.reduce((min,v) => Math.min(v,min));
const max = c => c.reduce((max,v) => Math.max(v,max));
const findNearestIndex = (c, x) => c.reduce((index,d,i)=> Math.abs(c[index] - x) > Math.abs(d - x) ? i : index, 0);

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
        seekerLeft: state.xRange[0]*600,
        seekerWidth: (state.xRange[1]-state.xRange[0])*600
    }
};