import Component from "../../core/component/component";
import {setRange} from "../../domain/actions";
import DomRenderer from "../../core/renderers/dom-renderer";
import ChartPreview from "../chart-preview/chart-preview";
import {seekerSelector} from '../../selectors/seeker-selector';
import {detailedChartSize, previewChartHeight} from "../../constants/charts-size";
import PureDomRenderer from "../../core/renderers/pure-dom-renderer";

const alignInRange = (value, minV, maxV) => {
    return Math.min(maxV, Math.max(minV, value));
};

const minRangeWidth = 30/detailedChartSize;

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

    leftResizer = new PureDomRenderer('div');

    rightResizer = new PureDomRenderer('div');

    selector(state){
        const {seekerLeft, seekerWidth} = seekerSelector(state);
        return {seekerLeft,seekerWidth};
    }

    getRef(){
        return this.grid;
    }

    dragged = false;

    dragPosition = null;

    dragTarget = null;

    dragStart = ({clientX, target}) => {
        this.dragged = true;
        this.dragPosition = clientX;
        this.dragTarget = target;
    };

    touchStart = ({changedTouches}) => {
        this.dragStart(changedTouches[0]);
    };


    moveSeeker(diff){
        const {seekerLeft, seekerWidth} = this.attributes;
        const xStart = alignInRange((seekerLeft+diff)/detailedChartSize, 0, 1-seekerWidth/detailedChartSize);
        const xEnd = xStart + seekerWidth/detailedChartSize;
        this.actions.setRange([xStart, xEnd]);
    }

    moveLeftBorder(diff){
        const {seekerLeft, seekerWidth} = this.attributes;
        const xStart = alignInRange((seekerLeft+diff)/detailedChartSize, 0, (seekerLeft+seekerWidth)/detailedChartSize-minRangeWidth );
        const xEnd = (seekerLeft + seekerWidth)/detailedChartSize; //remains
        this.actions.setRange([xStart, xEnd]);
    }

    moveRightBorder(diff){
        const {seekerLeft,seekerWidth} = this.attributes;
        const xStart = seekerLeft/detailedChartSize;//remains
        const xEnd = alignInRange(xStart + (seekerWidth + diff)/detailedChartSize, xStart+minRangeWidth, 1);
        this.actions.setRange([xStart, xEnd]);
    }

    drag = ({clientX}) => {
        if(!this.dragged) {
            return;
        }
        const diff = clientX - this.dragPosition;
        if(this.dragTarget === this.seeker.ref){
            this.moveSeeker(diff);
        }else if(this.dragTarget === this.leftResizer.ref){
            this.moveLeftBorder(diff);
        }else if(this.dragTarget === this.rightResizer.ref){
            this.moveRightBorder(diff);
        }
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
        this.dragTarget = null;
        this.dragPosition = null;
    };

    touchEnd = ({changedTouches}) => {
        this.dragEnd(changedTouches[0]);
    };

    renderLeftResizer(){
        return this.leftResizer
            .style('height', `${previewChartHeight-6}px`)
            .style('width', '15px')
            .style('background-color', 'rgba(119, 171, 207, 0.25)')
            .style('position', 'absolute')
            .style('left', '0px');
    }

    renderRightResizer(){
        return this.rightResizer
            .style('height', `${previewChartHeight-6}px`)
            .style('width', '15px')
            .style('background-color', 'rgba(119, 171, 207, 0.25)')
            .style('position', 'absolute')
            .style('right', '0px');
    }

    renderSeeker(){
        const {seekerWidth} = this.attributes;
        return this.seeker
            .style('display', 'inline-block')
            .style('position', 'relative')
            .style('box-sizing', 'border-box')
            .style('width', `${seekerWidth}px`)
            .style('height', `${previewChartHeight}px`)
            .style('border-width', '3px 0px')
            .style('border-style', 'solid')
            .style('border-color', 'rgba(119, 171, 207, 0.25)')
            .style('background-color', 'transparent')
            .style('cursor', 'pointer')
            .on('mousedown',this.dragStart)
            .on('touchstart', this.touchStart)
            .children([
                this.renderLeftResizer(),
                this.renderRightResizer()
            ])
            .render();
    }


    renderLeftField(){
        return this.leftField
            .style('background-color', 'rgba(242, 247, 250,0.75 )')
            .style('display', 'inline-block')
            .style('height', `${previewChartHeight}px`)
            .style('width', `${detailedChartSize}px`);
    }

    renderRightField(){
        return this.rightField
            .style('background-color', 'rgba(242, 247, 250,0.75 )')
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