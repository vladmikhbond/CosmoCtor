import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{
 
    static calcAccelerations(M:number, R:number):number[] 
    {
        let arr = new Array(R|0 + 1).fill(0);
        const N = 200;
        for (let a = 1; a <= R; a += 1) {
            arr[a] = doubleIntegral(M, R, a, N);
        }
        return arr;

        // --------------- local function -------------------

        function doubleIntegral(M:number, R:number, a:number, n:number):number 
        {
            const dw = Math.PI / n, 
                  dz = R / n,  
                  dm = M / (n**2),
                  aa = a * a;
            let force = 0;

            for (let w = 0; w < Math.PI; w += dw) 
            {
                let cosW = Math.cos(w + dw/2); 
                let a2cosW = 2 * a * cosW; 

                for (let z = 1; z < R; z += dz) {
                    let r = Math.sqrt(z * z + aa - z * a2cosW);
                    if (r) {
                        let rx = a - z * cosW;
                        force += dm * rx / r**3;
                    }
                } 
            } 
            // NOTE: negative values are forbidden (they are possible when n is too small)
            return force > 0 ? force * 2 * M / R : 0;
        }

    }

    static splitOnPieces(n: number, nebulaR: number, proto: Planet): Array<Planet> {
        let pieces: Array<Planet> = [];
        let m = proto.m / n;
        let r = proto.r / n**0.5;

        // Розподіл рівномірний по куту (від 0 до 2PI) і по відстані (від 0 до nebulaR) 
        
        while (n) 
        { 
            let dist = Math.random() * nebulaR;
            let angle = Math.random() * 2 * Math.PI;
            let x = dist * Math.cos(angle);
            let y = dist * Math.sin(angle);
            //if (notTooClose(x, y)) {
                let piece = new Planet(`_`, m, r, x, y, 0, 0, proto.color);
                pieces.push(piece);
                n--;      
            //}
        }
        return pieces;

        // --------------- local function -------------------
        
        function notTooClose(x: number, y: number) {
            for(let p of pieces) {
                let dd = (p.x - x)**2 + (p.y - y)**2;
                let e = m / dd;
                if (e > 0.001) return false;
            }
            return true;
        }
        
    }

    constructor(n: number, nebulaR: number, veloK: number, proto: Planet, space: Space)
    {            
        let pieces = Nebula.splitOnPieces(n, nebulaR, proto);

        // set init velocities
        let accels = Nebula.calcAccelerations(proto.m, nebulaR);

        // console.log(accels)    ///////////////////////

        for (let piece of pieces) {            
            let r = Math.sqrt(piece.x**2 + piece.y**2);
            let v = Math.sqrt(accels[r|0] * r);
            let angle = Math.atan2(piece.y, piece.x) + Math.PI / 2;

            let dir = Math.random() > veloK ? 1 : -1;                           
            piece.vx = dir * v * (Math.cos(angle)); 
            piece.vy = dir * v * (Math.sin(angle)); 
        }

        // find center of mass
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
        
        // final places & velocities of pieces
        for (let piece of pieces) {
            piece.x += proto.x - mx;  
            piece.y += proto.y - my;
            piece.vx += proto.vx - mvx;  
            piece.vy += proto.vy - mvy;
            space.planets.push(piece);
        }
 
        space.removePlanet(proto);

    }

}