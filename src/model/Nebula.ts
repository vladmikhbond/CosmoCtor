import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{
 
    constructor(n: number, nebulaR: number, proto: Planet, space: Space)
    { 
        space.removeSelectedPlanet();

        type Piece = {x: number, y: number, ax: number, ay: number, angle: number, r: number};
        
        // static pieces
        let pieces: Array<Piece> = [];
        let m = proto.m / n;
        let r = proto.r / n**0.5;

        // Розподіл рівномірний по куту (від 0 до 2PI) і по радіусу (від 0 до nebulaR) 
        for (let i = 0; i < n/2; i++) {
            let r = Math.random() * nebulaR;
            let angle = Math.random() * 2 * Math.PI;
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            pieces.push({x, y, ax: 0, ay: 0, angle, r});
            x = -x; y = -y; angle += Math.PI;
            pieces.push({x, y, ax: 0, ay: 0, angle, r});
        }
        
        // acceleration of pieces

        for (let p0 of pieces) {
            for (let p of pieces) {
                if (p == p0) continue;
                let rr = (p.x - p0.x)**2 + (p.y - p0.y)**2;
                
                let r = Math.sqrt(rr);
                p0.ax += (p.x - p0.x) / rr / r;
                p0.ay += (p.y - p0.y) / rr / r;
            }        
            p0.ax *= glo.G * m;
            p0.ay *= glo.G * m;
        }

        // set init velocities
        const K = 0.5;
        for (let piece of pieces) {
            let a = Math.sqrt(piece.ax**2 + piece.ay**2);
            let v = K * Math.sqrt(a * piece.r);   
            let vx = v * (Math.cos(piece.angle + Math.PI / 2)) //    + Math.random()*0.001 - 0.0005;
            let vy = v * (Math.sin(piece.angle + Math.PI / 2)) //   + Math.random()*0.001 - 0.0005;
            let x = piece.x + proto.x;
            let y = piece.y + proto.y;
            space.planets.push(new Planet(`_`, m, r, x, y, proto.vx + vx, proto.vy + vy, proto.color));
        }

        // 
        space.removePlanet(proto);

    }

}