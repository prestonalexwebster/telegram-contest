import Component from "../../core/component/component";
import {setRange} from "../../domain/actions";
import DomRenderer from "../../core/renderers/dom-renderer";
import ChartPreview from "../chart-preview/chart-preview";
import {seekerSelector} from '../../selectors/points-selectors';
import {detailedChartSize, previewChartHeight} from "../../constants/charts-size";
import PureDomRenderer from "../../core/renderers/pure-dom-renderer";

export default class ControlledChartPreview extends Component {

    actions = {
        setRange: setRange
    };

    container = new DomRenderer('div');

    chartPreview = this.createComponent(ChartPreview);

    controlsContainer = new DomRenderer('div');

    seeker = new DomRenderer('div');

    group = new DomRenderer('div');

    leftField = new PureDomRenderer('div');

    rightField = new PureDomRenderer('div');

    selector(state){
        const {seekerLeft, seekerWidth} = seekerSelector(state);
        return {seekerLeft,seekerWidth};
    }

    getRef(){
        return this.grid;
    }

    dragged = false;

    dragPosition = null;

    dragStart = ({clientX}) => {
        this.dragged = true;
        this.dragPosition = clientX;
    };

    touchStart = ({changedTouches}) => {
        this.dragStart(changedTouches[0]);
    };

    drag = ({clientX}) => {
        if(!this.dragged) {
            return;
        }
        const diff = clientX - this.dragPosition;
        const {seekerLeft, seekerWidth} = this.attributes;
        const xStart = Math.max(0,Math.min((seekerLeft+diff)/detailedChartSize,1-seekerWidth/detailedChartSize));
        const xEnd = xStart + seekerWidth/detailedChartSize;
        this.actions.setRange([xStart, xEnd]);
        this.dragPosition = clientX;
    };

    touch = ({changedTouches}) => {
        this.drag(changedTouches[0]);
    };

    dragEnd = () => {
        if(!this.dragged) {
            return;
        }
        this.dragged = false;
    };

    touchEnd = ({changedTouches}) => {
        this.dragEnd(changedTouches[0]);
    };

    renderSeeker(){
        const {seekerWidth} = this.attributes;
        return this.seeker
            .style('display', 'inline-block')
            .style('width', `${seekerWidth}px`)
            .style('height', `${previewChartHeight}px`)
            .style('background-color', 'transparent')
            .style('cursor', 'pointer')
            .on('mousedown',this.dragStart)
            .on('touchstart', this.touchStart)
            .render();
    }


    renderLeftField(){
        return this.leftField
            .style('background-color', 'rgba(26, 105,155, 0.04)')
            .style('display', 'inline-block')
            .style('height', `${previewChartHeight}px`)
            .style('width', `${detailedChartSize}px`);
    }

    renderRightField(){
        return this.rightField
            .style('background-color', 'rgba(26, 105,155, 0.04)')
            .style('display', 'inline-block')
            .style('height', `${previewChartHeight}px`)
            .style('width', `${detailedChartSize}px`);
    }


    renderGroup(){
        const {seekerLeft} = this.attributes;
        return this.group
            .style('display', 'block')
            .style('width', `${detailedChartSize*3}px`)
            .style('transform', `translateX(${seekerLeft-detailedChartSize}px)`)
            .children([
                this.renderLeftField(),
                this.renderSeeker(),
                this.renderRightField()
            ])
            .render();
    }

    renderControls(){
        return this.controlsContainer
            .style('position', 'absolute')
            .style('z-index', '1000')
            .style('overflow', 'hidden')
            .style('width', `${detailedChartSize}px`)
            .style('height', `${previewChartHeight}px`)
            .style('left',0)
            .style('top', 0)
            .on('touchmove', this.touch)
            .on('mousemove', this.drag)
            .on('touchend', this.touchEnd)
            .on('mouseup', this.dragEnd)
            .on('mouseleave', this.dragEnd)
            .children([
                this.renderGroup()
            ])
            .render();
    }

    renderContainer(children){
        return this.container
            .style('position', 'relative')
            .style('user-select', 'none')
            .children(children)
            .render();
    }


    render(){
        return this.renderContainer([
            this.chartPreview.render(),
            this.renderControls()
        ]);
    }
}