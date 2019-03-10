import ChartPreview from './components/chart-preview/chart-preview';
import DataStorage from './utils/data-storage';
import PointsController from './domain/poinst-controller';

const pointsController = new PointsController();
const store = new DataStorage();


const chartPreview = new ChartPreview();

chartPreview.render();
chartPreview.mount(document.body);

store.subscribe(state => {
   chartPreview.attr('points', state.points)
       .render();
});

store.setState(pointsController.loadPoints);



