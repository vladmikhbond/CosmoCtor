import { glo } from "../globals/globals.js";
import Track from './Track.js';

export default class Planet 
{
    static TRACK_INTERVAL = 5;

    ax = 0;
    ay = 0;
    track: Track;
   
    
    constructor(
        public name: string = 'Noname',
        public m: number = 1000, public r: number = 10,
        public x: number = 0, public y: number = 0,
        public vx: number = 0, public vy: number = 0, 
        public color: string = 'white',
    ) 
    { 
        this.track = new Track(this);
    }

    step() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;

        // add point to track
        if (glo.stepsCount % Planet.TRACK_INTERVAL == 0) {
            this.track.addPoint(this.x, this.y)
        }
    }

    get v(): number {
        return Math.sqrt(this.vx ** 2 + this.vy ** 2);
    }
    
    // e - одиничний вектор швидкості
    e(): [number, number] {
            
            let ex = 1, ey = 0;
            let pv = this.v;
            if (pv) {
                ex = this.vx / pv;
                ey = this.vy / pv;
            }
        return[ex, ey];
    }
    
}

