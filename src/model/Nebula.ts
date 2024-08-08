import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{
    N: number;
     
    constructor(s: Space, p: Planet) 
    { 
        this.N = p.m / 0.001 | 0;
        
        for (let i = 0; i < this.N; i++) {
            let x = p.x + Math.random() * 2 * p.r - p.r;
            let y = p.y + Math.random() * 2 * p.r - p.r;
            let vx = Math.random() * 2 - 1;
            let vy = Math.random() * 2 - 1;
            let q = new Planet("", 0.001, 0.5, x, y, vx, vy, p.color );
            s.planets.push(q);
        }
    }

}