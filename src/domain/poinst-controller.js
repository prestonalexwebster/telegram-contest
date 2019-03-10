
const points = [0,50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800];

const getDummyPoints = () => {
    return points.map(x => ({x,y:10+Math.random()*80}));
};

export default class PointsController {

    loadPoints = state => {
        return {
            ...state,
            points: getDummyPoints()
        };
    }
}

