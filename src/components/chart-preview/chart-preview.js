import DomRenderer from '../../core/renderers/dom-renderer';
import Component from '../../core/component/component';
import {ChildrenTagsRenderer} from "../../core/renderers/children-renderer";
import {linesSelector} from "../../selectors/points-selectors";


export default class ChartPreview extends Component {

    chartContainer = new DomRenderer('svg', {svg: true});

    linesRenderer = new ChildrenTagsRenderer('path', {pure: true, svg: true});

    getRef(){
        return this.chartContainer;
    }

    selector = state => {
        const lines = linesSelector(state);
        return {lines};
    };

    renderChart(children){
        return this.chartContainer
            .attr('viewBox', "0 0 1 1")
            .attr('width', '600px')
            .attr('height', '50px')
            .attr('preserveAspectRatio',"none")
            .children(children)
            .render();
    }

    renderPath = (lines, i, path) => {
         return path.attr('d', lines.path)
             .attr('stroke', lines.color)
             .attr("vector-effect","non-scaling-stroke")
             .attr('stroke-width', '1px')
             .attr('fill', 'none');
    };

    render(){
        const {lines = []} = this.attributes;
        return this.renderChart(this.linesRenderer.render(lines, (l, i) => i, this.renderPath));
    }
}