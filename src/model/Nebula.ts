import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{
 
    static splitOnPieces(n: number, nebulaR: number, proto: Planet): Array<Planet> {
        let pieces: Array<Planet> = [];
        let m = proto.m / n;
        let r = proto.r / n**0.5;

        // Розподіл рівномірний по куту (від 0 до 2PI) і по відстані (від 0 до nebulaR) 
        let protector = 0;
        while (n && protector < 1000000 ) {
            let dist = Math.random() * nebulaR;
            let angle = Math.random() * 2 * Math.PI;
            let x = dist * Math.cos(angle);
            let y = dist * Math.sin(angle);
            if (isValid(x, y)) {
                let piece = new Planet(`_`, m, r, x, y, 0, 0, proto.color);
                pieces.push(piece);
                n--; 
            }
            protector++;    
        }
        return pieces;

        function isValid(x: number, y: number) {
            for(let p of pieces) {
                let dd = (p.x - x)**2 + (p.y - y)**2;
                let e = m / dd;
                if (e > 0.001) 
                    return false;
            }
            return true;
        }
        
    }

    constructor(n: number, nebulaR: number, veloK: number, proto: Planet, space: Space)
    {            
        let pieces = Nebula.splitOnPieces(n, nebulaR, proto);

        // count acceleration for all pieces
        for (let p0 of pieces) {
            let ax = 0, ay = 0;
            for (let p of pieces) {
                if (p == p0) {
                    continue;
                }                   
                let rr = (p.x - p0.x)**2 + (p.y - p0.y)**2;
                let rrr = Math.sqrt(rr) * rr;
                if (rr) { 
                    ax += p.m * (p.x - p0.x) / rrr;
                    ay += p.m * (p.y - p0.y) / rrr;
                }
            } 
            // velo direction
            let dir = Math.random() > veloK ? 1 : -1;       
            p0.ax = dir * glo.G * ax;
            p0.ay = dir * glo.G * ay;
        }


        // set init velocities

        for (let piece of pieces) {
            let a = Math.sqrt(piece.ax**2 + piece.ay**2);
            let r = Math.sqrt(piece.x**2 + piece.y**2);
            let k = 0.9; 
            
            let v = k * Math.sqrt(a * r) ;

            
            let angle = Math.atan2(piece.ay, piece.ax) + Math.PI / 2; 
 
            piece.vx = v * (Math.cos(angle)); 
            piece.vy = v * (Math.sin(angle)); 
        }

        // center of mass
        let msum = 0, mx = 0, my = 0, mvx = 0, mvy = 0; 
        for (let p of pieces) {
            mx += p.x * p.m;
            my += p.y * p.m;
            mvx += p.vx * p.m;
            mvy += p.vy * p.m;
            msum += p.m;

        }
        mx /= msum;
        my /= msum;
        mvx /= msum;
        mvy /= msum;
         
        for (let piece of pieces) {
            piece.x += proto.x - mx;  
            piece.y += proto.y - my;
            piece.vx += proto.vx - mvx;  
            piece.vy += proto.vy - mvy;
            space.planets.push(piece);
        }


        // 
        space.removePlanet(proto);

    }

}