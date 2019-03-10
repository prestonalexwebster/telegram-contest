
const min  = c => c.reduce((min,v) => Math.min(v,min),Infinity);
const max = c => c.reduce((max,v) => Math.max(v,max),-Infinity);

//todo: move it from globals
const rangeX = [0, 800];
const rangeY = [0, 50];

//todo: make a real selector
//todo: move scaling to the other selector
export const linesSelector = state => {
    if(!state.charts) return null;
    const chart = state.charts[0];
    const [xlabel, ...xColumn] = chart.columns.find(c => c[0] === 'x');
    const yColumns = chart.columns.filter( c => c[0] !== 'x')
        .reduce((a,[label, ...column]) => {
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
    return  Object.entries(yColumns).map(([yTitle, column]) =>{
            return column.map((value, index)=>{
                 return {
                     x: (xColumn[index] - xMin)/(xMax-xMin)*rangeX[1],
                     y: rangeY[1] - (value - yMin)/(yMax-yMin)*rangeY[1],
                     xValue: xColumn[index],
                     yValue: value,
                     color: chart.colors[yTitle],
                     name: chart.names[yTitle]
                 };
            });
        } );
};