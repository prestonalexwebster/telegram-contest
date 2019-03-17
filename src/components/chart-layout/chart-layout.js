import Component from "../../core/component/component";
import DomRenderer from "../../core/renderers/dom-renderer";
import ControlledDetailedChart from "../controlled-detailed-chart/controlled-detailed-chart";
import ControlledChartPreview from '../controlled-chart-preview/controlled-chart-preview';
import {fetchCharts, showChart, hideChart} from "../../domain/actions";
import {detailedChartSize} from "../../constants/charts-size";
import {ChildrenTagsRenderer} from "../../core/renderers/children-renderer";
import {togglersStateSelector} from '../../selectors/hidden-charts-selectors';
import DateAxis from "../date-axis/date-axis";


export default class ChartLayout extends Component {

    actions = {
        fetchCharts: fetchCharts,
        showChart: showChart,
        hideChart: hideChart
    };

    grid = new DomRenderer('div');

    chartDetailed = this.createComponent(ControlledDetailedChart);

    chartPreview = this.createComponent(ControlledChartPreview);

    chartXAxis = this.createComponent(DateAxis);

    chartControlsContainer = new DomRenderer('div');

    togglersRenderer = new  ChildrenTagsRenderer('div', {pure: false});

    getRef(){
        return this.grid;
    }

    selector =  state => {
    const togglersState = togglersStateSelector(state);
    return {togglersState};
};

    componentDidMount(){
        this.actions.fetchCharts();
    }

    renderGrid(children){
        return this.grid
            .style('width', '100%')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('flex-direction', 'column')
            .children(children)
            .render();
    }

    renderToggler = ({id, visible, color, index, label, name}, i, toggler) => {
        return toggler.text(name)
                      .style('cursor', 'pointer')
            .style('background', visible ? color : 'transparent')
            .style('border', `2px solid ${color}`)
            .style('border-radius', '30%')
            .style('color', visible ? "#fff" : "#000")
            .style('user-select', 'none')
            .on('click', visible ? ()=>this.actions.hideChart(index, label) : ()=>this.actions.showChart(index, label))
            .render();
    };

    renderChartControls(){
        const {togglersState=[]} = this.attributes;
        return this.chartControlsContainer
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('flex-direction', 'row')
            .style('justify-content', 'space-between')
            .style('width', `${detailedChartSize}px`)
            .children(
                this.togglersRenderer.render(togglersState, chart => chart.id, this.renderToggler)
            )
            .render();
    }

    render(){
        return this.renderGrid([
            this.chartDetailed.render(),
            this.chartXAxis.render(),
            this.chartPreview.render(),
            this.renderChartControls()
        ]);
    }
}