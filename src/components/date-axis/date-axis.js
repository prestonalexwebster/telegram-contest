import Component from "../../core/component/component";
import DomRenderer from "../../core/renderers/dom-renderer";
import {ChildrenTagsRenderer} from "../../core/renderers/children-renderer";
import {ticksSelector} from "../../selectors/axis-selector";
import {detailedChartSize, xAxisHeight} from "../../constants/charts-size";
import {rangesSelector} from "../../selectors/ranges-selector";

const textXOffset = 5;

export default class DateAxis extends Component {

    axisContainer = new DomRenderer('svg', {svg: true});


    ticksRenderer = new ChildrenTagsRenderer('text', {pure: true, svg: true});

    selector = state => {
        const {xTicks} = ticksSelector(state);
        const {xRange} = rangesSelector(state);
        return {xTicks, xRange};
    };

    getRef(){
        return this.axisContainer;
    }

    renderTick = ({date, x}, i, tick) => {
        const {xRange = [0,1]} = this.attributes;
        return tick
            .attr('x', (x - xRange[0])/(xRange[1]-xRange[0])*detailedChartSize+textXOffset)
            .attr('y', '10')
            .attr('dominant-baseline', 'hanging')
            .attr('text-anchor', 'start')
            .attr('fill','#a0abb2')
            .attr('font-size', 20)
            .text(date);
    };


    render(){
        const {xTicks = []} = this.attributes;
        return this.axisContainer
            .attr('width', `${detailedChartSize}px`)
            .attr('height', `${xAxisHeight}px`)
            .style('border-top', '1px solid #ecf0f3')
            .children(
              this.ticksRenderer.render(xTicks, l => l.timeStamp, this.renderTick)
            )
            .render();
    }
}