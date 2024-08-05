import Planet from './Planet.js';

export default class Track {
    static MAX_LENGTH = 300;
    static CUT_BEGIN = 290;
    
    points: {x:number, y:number}[];

    constructor(p: Planet)
    { 
        this.points = [{x: p.x, y: p.y}];
    }

    addPoint(x: number, y: number) {
        if (this.points.length >= Track.MAX_LENGTH) {
            this.points.splice(0, Track.CUT_BEGIN);
        }
        this.points.push({x, y});
    }
}