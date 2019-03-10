import DomRenderer from '../../utils/dom-renderer';
import Component from '../../utils/component';
import {TagsFactory} from "../../utils/elements-factory";

export default class ChartPreview extends Component {

    chartContainer = new DomRenderer('svg', {svg: true});

    pointsFactory = new TagsFactory('circle', {svg: true});

    getRef(){
        return this.chartContainer;
    }

    renderChart(children){
        return this.chartContainer
            .attr('width', '800px')
            .attr('height', '100px')
            .children(children)
            .render();
    }

    renderPoint = ({x,y}, i, point) => {
         return point.attr('cx',x)
             .attr('cy', 100-y)
             .attr('r', 2)
             .attr('fill', 'blue')
             .render();
    };

    render(){
        const {points = []} = this.attributes;
        return this.renderChart(this.pointsFactory.render(points, (p,i) => i, this.renderPoint));
    }
}