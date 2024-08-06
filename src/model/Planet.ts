import { glo } from "../globals/globals.js";
import Track from './Track.js';

export default class Planet 
{
    static TRACK_INTERVAL = 5;

    // static getStandardPlanet(): Planet {
    //     return new Planet('Noname', 5,  5,   0, 0,   5, 5, 'white');
    // }

    ax = 0;
    ay = 0;
    track: Track;
   
    
    constructor(
        public name: string = 'Noname',
        public m: number = 5, public r: number = 5,
        public x: number = 0, public y: number = 0,
        public vx: number = 5, public vy: number = 5, 
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
    
    
}

