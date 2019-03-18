import ChartLayout from "./components/chart-layout/chart-layout";
import reducer from './domain/reducer';
import AppBuilder from './core/app-builder'
import './global.css'

const app = new AppBuilder()
    .reducer(reducer)
    .parent(document.body)
    .root(ChartLayout)
    .build();