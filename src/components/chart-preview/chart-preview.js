import DomRenderer from '../../core/dom-renderer';
import Component from '../../core/component';
import {TagsFactory} from "../../core/elements-factory";


function getLinearPath(points){
    const [start, ...restPoints] = points;
    return `M${start.x} ${start.y} ${restPoints.map(({x,y}) => `L${x} ${y}`).join(' ')}`;
}

export default class ChartPreview extends Component {

    chartContainer = new DomRenderer('svg', {svg: true});

    lineFactory = new TagsFactory('path', {svg: true});

    getRef(){
        return this.chartContainer;
    }

    renderChart(children){
        return this.chartContainer
            .attr('width', '800px')
            .attr('height', '50px')
            .children(children)
            .render();
    }

    renderPath = (points, i, path) => {
         return path.attr('d', getLinearPath(points))
             .attr('stroke', points[0].color)
             .attr('fill', 'none')
             .render();
    };

    render(){
        const {lines = []} = this.attributes;
        return this.renderChart(this.lineFactory.render(lines, (l,i) => i, this.renderPath));
    }
}