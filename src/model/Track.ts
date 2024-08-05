import Planet from './Planet.js';

export default class Track {
    private static MAX_LENGTH = 300;
    private static CUT_LENGTH = 150;
    
    points: {x:number, y:number}[];

    constructor(p: Planet)
    { 
        this.points = [{x: p.x, y: p.y}];
    }

    addPoint(x: number, y: number) {
        if (this.points.length >= Track.MAX_LENGTH) {
            this.points.splice(0, Track.CUT_LENGTH);
        }
        this.points.push({x, y});
    }
}