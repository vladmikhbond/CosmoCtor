import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{

     
    constructor(n: number, nebulaR: number, space: Space)
    { 
        let planet = space.selectedPlanet!;
        space.removeSelectedPlanet();

        type Piece = {x: number, y: number, ax: number, ay: number, angle: number, r: number};
        
        // static pieces
        let pieces: Array<Piece> = [];

        for (let i = 0; i < n; i++) {
            let r = Math.random() * nebulaR;
            let angle = Math.random() * 2 * Math.PI;
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            pieces.push({x, y, ax: 0, ay: 0, angle, r}); 
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
        let m = planet.m / n;
        let r = planet.r / n**0.5;

        for (let i = 0; i < n; i++) {
            let piece = pieces[i];
            let a = Math.sqrt(piece.ax**2 + piece.ay**2);
            let v = 1 * Math.sqrt(a * piece.r);     
            let vx = planet.vx + v * (Math.cos(piece.angle + Math.PI / 2));
            let vy = planet.vy + v * (Math.sin(piece.angle + Math.PI / 2));

            space.planets.push(new Planet(`_`+i, m, r, 
                piece.x + planet.x, 
                piece.y + planet.y, 
                vx, vy, planet.color));
        }

        space.step();
    }

}