import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{

     
    constructor(n: number, nebulaR: number, space: Space)
    { 
        let planet = space.selectedPlanet!;
        space.tryRemoveSelectedPlanet();

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
        let m = planet.m / n;
        let r = planet.r / n**0.5;

        for (let i = 0; i < n; i++) {
            let piece = pieces[i];
            let a = Math.sqrt(piece.ax**2 + piece.ay**2);
            let v = 1 * Math.sqrt(a * piece.r);     
            let vx = v * (Math.cos(piece.angle + Math.PI / 2));
            let vy = v * (Math.sin(piece.angle + Math.PI / 2));

            space.planets.push(new Planet(`x`+i, m, r, 
                piece.x + planet.x, piece.y + planet.y, 
                vx, vy, planet.color));
        }

        space.step();  
    }

}