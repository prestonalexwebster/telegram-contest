import {detailedChartSize} from "../../constants/charts-size";
import Component from "../../core/component/component";
import DomRenderer from "../../core/renderers/dom-renderer";
import DetailedChart from "../detailed-chart/detailed-chart";
import {ticksSelector} from "../../selectors/axis-selector";
import {ChildrenTagsRenderer} from "../../core/renderers/children-renderer";
import PureDomRenderer from "../../core/renderers/pure-dom-renderer";
import DetailedChartTooltip from '../detailed-chart-tooltip/detailed-chart-tooltip'

export default class ControlledDetailedChart extends Component {


    container = new DomRenderer('div');

    chartDetailed = this.createComponent(DetailedChart);

    detailedChartTooltip = this.createComponent(DetailedChartTooltip);

    chartDetailedContainer = new DomRenderer('div');

    tooltipContainer = new DomRenderer('div');

    controlsContainer = new DomRenderer('svg', {svg: true});

    axisRenderer = new ChildrenTagsRenderer('line', {pure: true, svg: true});

    axisTitlesRenderer = new ChildrenTagsRenderer('text', {pure: true, svg: true});

    zeroTitle = new PureDomRenderer('text', {svg: true});


    selector(state){
        const {yTicks} = ticksSelector(state);
        return {yTicks};
    }

    getRef(){
        return this.container;
    }


    renderAxis = ({y}, i, axis) => {
        return axis
            .attr('y1', (1-y)*detailedChartSize)
            .attr('y2', (1-y)*detailedChartSize)
            .attr('x1',0)
            .attr('x2', detailedChartSize)
            .attr('stroke','#ecf0f3');
    };

    renderAxisTitle = ({y, value}, i, axis) => {
        return axis
            .attr('y', (1-y)*detailedChartSize-5)
            .attr('x',0)
            .attr('dominant-baseline', 'baseline')
            .attr('text-anchor', 'start')
            .attr('fill','#b0b9bf')
            .text(value);
    };

    renderZero(){
        return this.zeroTitle
            .attr('x', 0)
            .attr('y',detailedChartSize-5)
            .attr('dominant-baseline', 'baseline')
            .attr('text-anchor', 'start')
            .attr('fill','#b0b9bf')
            .text('0');
    }

    renderAxisGrid(){
        const {yTicks = []} = this.attributes;
        return this.controlsContainer
            .style('position', 'absolute')
            .style('z-index', 1)
            .style('width', `${detailedChartSize}px`)
            .style('height', `${detailedChartSize}px`)
            .style('left',0)
            .style('top', 0)
            .children([
                this.renderZero(),
                ...this.axisRenderer.render(yTicks, l => l.value, this.renderAxis),
                ...this.axisTitlesRenderer.render(yTicks, l => l.value, this.renderAxisTitle)
            ])
            .render();
    }

    renderDetailedChart(){
        return this.chartDetailedContainer
            .style('position', 'absolute')
            .style('z-index',2000)
            .children([this.chartDetailed.render()])
            .render();
    }

    renderDetailedChartTooltip(){
        return this.tooltipContainer
            .style('position', 'absolute')
            .style('z-index',3000)
            .children([this.detailedChartTooltip.render()])
            .render();
    }

    renderContainer(children){
        return this.container
            .style('position', 'relative')
            .style('width', `${detailedChartSize}px`)
            .style('height', `${detailedChartSize}px`)
            .style('user-select', 'none')
            .children(children)
            .render();
    }


    render(){
        return this.renderContainer([
            this.renderAxisGrid(),
            this.renderDetailedChart(),
            this.renderDetailedChartTooltip()
        ]);
    }
}