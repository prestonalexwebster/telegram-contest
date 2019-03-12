import Store from './core/store';
import ChartLayout from "./components/chart-layout/chart-layout";
import reducer from './domain/reducer';
import ComponentsFactory from './core/components-factory';

const store = new Store(reducer);
const componentsFactory = new ComponentsFactory(store);

const chartLayout = componentsFactory.create(ChartLayout);

chartLayout.render();
chartLayout.mount(document.body);




