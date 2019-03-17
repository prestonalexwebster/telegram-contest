import DomRenderer from '../../core/renderers/dom-renderer';
import Component from '../../core/component/component';
import {ChildrenTagsRenderer} from "../../core/renderers/children-renderer";
import {linesSelector} from "../../selectors/lines-selector";
import {detailedChartSize} from "../../constants/charts-size";
import {rangesSelector} from "../../selectors/ranges-selector";

function getTransform([xMin, xMax], [yMin, yMax]){
    return `scale(${1/(xMax-xMin)}, ${1/(yMax-yMin)}) translate(${-xMin},${yMax-1})`
}

export default class DetailedChart extends Component {

    chartContainer = new DomRenderer('svg', {svg: true});

    view = new DomRenderer('g', {svg: true});

    linesRenderer = new ChildrenTagsRenderer('path', {pure: true, svg: true});

    selector = state => {
        const lines = linesSelector(state);
        const {xRange, yRange} = rangesSelector(state);
        return {lines, xRange, yRange};
    };

    getRef(){
        return this.chartContainer;
    }

    renderChart(children){
        return this.chartContainer
            .attr('viewBox', "0 0 1 1")
            .attr('width', `${detailedChartSize}px`)
            .attr('height', `${detailedChartSize}px`)
            .attr('preserveAspectRatio',"none")
            .children(children)
            .render();
    }

    renderPath = (lines, i, path) => {
        return path.attr('d', lines.path)
            .attr('stroke', lines.color)
            .attr("vector-effect","non-scaling-stroke")
            .attr('stroke-width', '3px')
            .attr('fill', 'none');
    };

    renderView = (children) => {
        const {xRange = [0,1], yRange = [0,1]} = this.attributes;
        return this.view
            .attr('transform', getTransform(xRange, yRange))
            .children(children)
            .render();
    };

    render(){
        const {lines = []} = this.attributes;
        return this.renderChart(
            [this.renderView(
                this.linesRenderer.render(lines, (l, i) => i, this.renderPath)
            )]
        );
    }
}