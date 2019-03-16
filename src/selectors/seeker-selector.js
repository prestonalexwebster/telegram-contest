import {detailedChartSize} from "../constants/charts-size";

export const seekerSelector = state => {
    if (!state.xRange) return {};
    return {
        seekerLeft: state.xRange[0] * detailedChartSize,
        seekerWidth: (state.xRange[1] - state.xRange[0]) * detailedChartSize
    }
};