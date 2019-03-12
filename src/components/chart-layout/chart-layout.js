import Component from "../../core/component/component";
import DomRenderer from "../../core/renderers/dom-renderer";
import ChartDetailed from "../chart-detailed/chart-detailed";
import ChartPreview from "../chart-preview/chart-preview";
import {fetchCharts} from "../../domain/actions";


export default class ChartLayout extends Component {

    actions = {
        fetchCharts: fetchCharts
    };

    grid = new DomRenderer('div');

    chartDetailed = this.createComponent(ChartDetailed);

    chartPreview = this.createComponent(ChartPreview);

    test = new DomRenderer('span');

    getRef(){
        return this.grid;
    }

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


    render(){
        return this.renderGrid([
            this.chartDetailed.render(),
            this.chartPreview.render(),
            this.test.text("Hello").render()
        ]);
    }
}