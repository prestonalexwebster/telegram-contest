import Component from "../../core/component/component";
import DomRenderer from "../../core/renderers/dom-renderer";
import {ChildrenTagsRenderer} from "../../core/renderers/children-renderer";
import {detailedChartSize} from "../../constants/charts-size";
import {groupedPointsSelector} from '../../selectors/grouped-points-selector';

class Axis extends Component {

    group = new DomRenderer('g', {svg: true});

    line = new DomRenderer('line', {svg: true});

    pointsRenderer = new ChildrenTagsRenderer('circle', {svg: true, pure: true});

    rect = new DomRenderer('rect', {svg: true});

    getRef(){
        return this.group;
    }

    renderRect(){
        const {rectX, width} = this.attributes;
        return this.rect
            .attr('width',width)
            .attr('height', detailedChartSize)
            .attr('fill','transparent')
            .attr('y',0)
            .attr('x', rectX*detailedChartSize)
            .render();
    }

    renderLine(){
        const {x} = this.attributes;
        return this.line
            .attr('y1',0)
            .attr('y2', detailedChartSize)
            .attr('x1', x*detailedChartSize)
            .attr('x2', x*detailedChartSize)
            .attr('stroke', '#ecf0f3')
            .render();
    }

    renderPoint = ({x,y, color}, i, point) => {
        return point
            .attr('cx',x*detailedChartSize)
            .attr('cy', (1-y)*detailedChartSize)
            .attr('r', 7)
            .attr('stroke', color)
            .attr('stroke-width', 3)
            .attr('fill', '#fff');
    };

    render(){
        const {points} = this.attributes;
        return this.group
            .classes(['chart-x-axis'])
            .children([
                this.renderLine(),
                ...this.pointsRenderer.render(points, p => p.y, this.renderPoint),
                this.renderRect()
            ])
            .render();
    }

}
//todo: implement tooltip popup
export default class DetailedChart extends Component {

    chartContainer = new DomRenderer('svg', {svg: true});

    axisRenderer = this.createChildrenRenderer(Axis);

    selector = state => {
        const groupedPoints = groupedPointsSelector(state);
        return {groupedPoints};
    };

    getRef(){
        return this.chartContainer;
    }

    renderChart(children){
        return this.chartContainer
            .attr('width', `${detailedChartSize}px`)
            .attr('height', `${detailedChartSize}px`)
            .attr('preserveAspectRatio',"none")
            .children(children)
            .render();
    }

    renderAxis = ({width, points, rectX, x}, i, axis) => {
        return axis
            .attr('width',width)
            .attr('points', points)
            .attr('rectX', rectX)
            .attr('x', x)
            .render();
    };


    render(){
        const {groupedPoints = []} = this.attributes;
        return this.renderChart(
                this.axisRenderer.render(groupedPoints, (l, i) => i, this.renderAxis)
            );
    }
}