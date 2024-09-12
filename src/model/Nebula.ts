import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{
 
    constructor(n: number, nebulaR: number, veloK: number, proto: Planet, space: Space)
    { 
        //space.removeSelectedPlanet();   //// ????????
           
        // static pieces
        let pieces: Array<Planet> = [];
        let m = proto.m / n;
        let r = proto.r / n**0.5;

        // Розподіл рівномірний по куту (від 0 до 2PI) і по відстані (від 0 до nebulaR) 
        for (let i = 0; i < n; i++) {
            let dist = Math.random() * nebulaR;
            let angle = Math.random() * 2 * Math.PI;
            let x = dist * Math.cos(angle);
            let y = dist * Math.sin(angle);
            let piece = new Planet(`_`, m, r, x, y, 0, 0, proto.color);
            pieces.push(piece);   
        }
        
        // // Розподіл рівномірний по площині круга 
        // for (let i = 0; i < n; i++) {
        //     let x = Math.random() * 2 * nebulaR - nebulaR;
        //     let y = Math.random() * 2 * nebulaR - nebulaR;
        //     let dist = Math.sqrt(x*x + y*y);
        //     if (dist > nebulaR) {i--; continue;}
        //     let piece = new Planet(`_`, m, r, x, y, 0, 0, proto.color);
        //     pieces.push(piece);   
        // }

        // acceleration of pieces

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
            p0.ax = glo.G * ax;
            p0.ay = glo.G * ay;
        }


        // set init velocities
        // const K = 0.25;
        for (let piece of pieces) {
            let a = Math.sqrt(piece.ax**2 + piece.ay**2);
            let dist = Math.sqrt(piece.x**2 + piece.y**2);
            let v = veloK * Math.sqrt(a * dist);  
            
            let angle = Math.atan2(piece.y, piece.x) + Math.PI / 2; 
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