import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{

     
    constructor(n: number, planet: Planet, space: Space)
    { 
        let nebulaR = 400;
        type Piece = {x: number, y: number, ax: number, ay: number, angle: number, r: number};
        
        // static pieces
        let pieces: Array<Piece> = [];

        for (let i = 0; i < n; i++) {
            let rad = Math.random() * nebulaR;
            let theta = Math.random() * 2 * Math.PI;
            pieces.push({
                x: rad * Math.cos(theta),
                y: rad * Math.sin(theta),
                ax:0, ay: 0, angle: theta, r: rad});
        }
        // count acceleration 
        for (let p0 of pieces) {
            for (let p of pieces) {
                if (p == p0) continue;
                let rr = (p.x - p0.x)**2 + (p.y - p0.y)**2;
                let r = Math.sqrt(rr);
                p0.ax += (p.x - p0.x) / rr / r;
                p0.ay += (p.y - p0.y) / rr / r;
            }        
            p0.ax *= glo.G;
            p0.ay *= glo.G;
        }
        // velo
        for (let i = 0; i < n; i++) {
            let p = pieces[i];
            let a = Math.sqrt(p.ax**2 + p.ay**2);
            let v = Math.sqrt(a * p.r);     
            let vx = v * (Math.cos(p.angle + Math.PI / 2));
            let vy = v * (Math.sin(p.angle + Math.PI / 2));
            let planet = new Planet("", 10, 1, p.x, p.y, vx, vy, "white");
            space.planets.push(planet);
        }
    }

}