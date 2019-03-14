import Component from "../../core/component/component";
import {setRange} from "../../domain/actions";
import DomRenderer from "../../core/renderers/dom-renderer";
import ChartPreview from "../chart-preview/chart-preview";
import {seekerSelector} from '../../selectors/points-selectors';

export default class ControlledChartPreview extends Component {

    actions = {
        setRange: setRange
    };

    container = new DomRenderer('div');

    chartPreview = this.createComponent(ChartPreview);

    controlsContainer = new DomRenderer('div');

    seeker = new DomRenderer('div');

    leftField = new DomRenderer('div');

    rightField = new DomRenderer('div');

    selector(state){
        const {seekerLeft = 550, seekerWidth = 50} = seekerSelector(state);
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
        const xStart = Math.max(0,Math.min((seekerLeft+diff)/600,1-seekerWidth/600));
        const xEnd = xStart + seekerWidth/600;
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
        const {seekerLeft, seekerWidth} = this.attributes;
        return this.seeker
            .style('position', 'absolute')
            .style('left', `${seekerLeft}px`)
            .style('width', `${seekerWidth}px`)
            .style('height', '50px')
            .style('background-color', 'transparent')
            .style('cursor', 'pointer')
            .on('mousedown',this.dragStart)
            .on('touchstart', this.touchStart)
            .render();
    }


    renderLeftField(){
        const {seekerLeft} = this.attributes;
        return this.leftField
            .style('position', 'absolute')
            .style('background-color', 'rgba(26, 105,155, 0.04)')
            .style('left',0)
            .style('top', 0)
            .style('height', '50px')
            .style('width', `${seekerLeft}px`)
            .render();
    }

    renderRightField(){
        const {seekerLeft, seekerWidth} = this.attributes;
        return this.rightField
            .style('position', 'absolute')
            .style('background-color', 'rgba(26, 105,155, 0.04)')
            .style('right',0)
            .style('top', 0)
            .style('height', '50px')
            .style('width', `${600-seekerLeft-seekerWidth}px`)
            .render();
    }

    renderControls(){
        return this.controlsContainer
            .style('position', 'absolute')
            .style('z-index', '1000')
            .style('width', '600px')
            .style('height', '50px')
            .style('left',0)
            .style('top', 0)
            .on('touchmove', this.touch)
            .on('mousemove', this.drag)
            .on('touchend', this.touchEnd)
            .on('mouseup', this.dragEnd)
            .on('mouseleave', this.dragEnd)
            .children([
                this.renderLeftField(),
                this.renderSeeker(),
                this.renderRightField()
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