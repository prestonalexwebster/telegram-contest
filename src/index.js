import ChartPreview from './components/chart-preview/chart-preview';
import DataStorage from './core/data-storage';
import {fetchCharts} from "./api/get-charts";
import {linesSelector} from "./selectors/points-selectors";
import ChartDetailed from "./components/chart-detailed/chart-detailed";


const store = new DataStorage();


const chartPreview = new ChartPreview();
const chartDetailed = new ChartDetailed();

chartDetailed.render();
chartDetailed.mount(document.body);

chartPreview.render();
chartPreview.mount(document.body);


store.subscribe(state => {
   const lines = linesSelector(state);
   chartPreview.attr('lines', lines)
       .render();
    chartDetailed.attr('lines', lines)
        .render();
});


fetchCharts().then( charts => store.setState(
    state => {
       return {...state, charts};
    }
));


