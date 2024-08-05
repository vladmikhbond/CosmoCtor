import { glo } from "../globals/globals.js";

export default class Planet 
{
    static TRACK_LENGTH = 300;

    static getStandardPlanet(): Planet {
        return new Planet('Noname', 5,  5,   0, 0,   5, 5, 'white');
    }

    ax = 0;
    ay = 0;
    track: {x:number, y:number}[] = new Array(Planet.TRACK_LENGTH).fill(null);
    trackPointer = -1;
    
    constructor(
        public name: string = 'Noname',
        public m: number = 5, public r: number = 5,
        public x: number = 0, public y: number = 0,
        public vx: number = 5, public vy: number = 5, 
        public color: string = 'white',
    ) 
    { 
    }

    step() {
        if (glo.stepsCount % 10 == 0) {
            this.trackPointer = (this.trackPointer + 1) % Planet.TRACK_LENGTH;
            this.track[this.trackPointer] = {x: this.x, y: this.y};
        }
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;             
    }
    
    
}

