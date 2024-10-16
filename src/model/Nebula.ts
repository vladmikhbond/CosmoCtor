import {glo} from '../globals/globals.js';
import Planet from "./Planet.js";
import Space from "./Space.js";

const mode = 1;

export default class Nebula
{
    static calcAccelPolar(M:number, R:number):number[] 
    {
        let arr = new Array(R|0 + 1).fill(0);
        const N = 200;
        for (let p = 1; p <= R; p += 1) {
            arr[p] = doubleIntegralPolar(M, R, p, N);
            //console.log(`polar\t${p}\t${arr[p]}`); ///////////////// DEBUG /////////
        }
        return arr;

        // --------------- local function -------------------

        function doubleIntegralPolar(M:number, R:number, p:number, n:number):number 
        {
            const dw = Math.PI / n, 
                  dz = R / n,
                  dm = (M/2) / n**2;
            let force = 0;

            for (let w = 0; w < Math.PI; w += dw) 
            {
                let cosW = Math.cos(w + dw/2); 
                let p2cosW = 2 * p * cosW; 

                for (let z = 1; z < R; z += dz) {
                    let r = Math.sqrt(z**2 + p**2 -  z *  p2cosW);
                    if (r) {
                        let rx = p - z * cosW;
                        force += rx / r**3;
                    }
                } 
            } 
            force *= 2 * dm * glo.G;
            // NOTE: negative values are forbidden (they are possible when n is too small)
            return force > 0 ? force : 0;
        }

    }

    static calcAccelDecart(M:number, R:number):number[] 
    {
        let arr = new Array(R|0 + 1).fill(0);
        const N = 200;
        for (let p = 1; p <= R; p += 1) {
            arr[p] = doubleIntegralDecart(M, R, p, N);
            //console.log(`decart\t${p}\t${arr[p]}`); ///////////////// DEBUG /////////
        }
        return arr;

        // --------------- local function -------------------

        function doubleIntegralDecart(M:number, R:number, p:number, n:number):number 
        {
            const dx = R / n, 
                  dy = R / n,
                  dm = (M / 2 / n**2) * (4 / Math.PI);
            let force = 0;

            for (let x = -R; x < R; x += dx) 
            {      
                let xx = x**2
                let x1 = x + dx/2;
                for (let y = 0; y < R; y += dy) {
                    let y1 = y + dy/2;
                    let r = Math.sqrt((p - x1)**2 + y1**2);
                    if (r) {                       
                        if (xx + y1**2 < R**2) {
                            let rx = p - x1 ;
                            force += rx / r**3;
                        }
                    }
                } 
            } 
            force *= 2 * dm * glo.G / 10;
            // NOTE: negative values are forbidden (they are possible when n is too small)
            return force > 0 ? force : 0;
        }

    }



    static splitOnPieces(n: number, nebulaR: number, proto: Planet): Array<Planet> {
        let pieces: Array<Planet> = [];
        let m = proto.m / n;
        let r = proto.r / n**0.5;
        
        if (!mode) {
            // Розподіл рівномірний по куту (від 0 до 2PI) і по відстані (від 0 до nebulaR)         
            while (n) 
            { 
                let dist = Math.random() * nebulaR;
                let angle = Math.random() * 2 * Math.PI;
                let x = dist * Math.cos(angle);
                let y = dist * Math.sin(angle);
                let piece = new Planet(`_`, m, r, x, y, 0, 0, proto.color);
                pieces.push(piece);
                n--;      
            }
        }
        else
        {
            // Розподіл рівномірний по декартовим координатам         
            while (n) 
            { 
                let x = (2 * Math.random() - 1) * nebulaR;
                let y = (2 * Math.random() - 1) * nebulaR;
                let rr = x*x + y*y;
                if (rr < nebulaR**2 && notTooClose(x, y)) {
                    let piece = new Planet(`_`, m, r, x, y, 0, 0, proto.color);
                    pieces.push(piece);
                    n--;      
                }
            }
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
        let accels = !mode ? 
            Nebula.calcAccelPolar(proto.m, nebulaR) :
            Nebula.calcAccelDecart(proto.m, nebulaR); 
            

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