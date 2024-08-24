import Planet from "./Planet.js";

export default class Rocket extends Planet
{
    constructor(k_velo: number, p: Planet) 
    { 
        let k = Math.sign(k_velo) * 2;
     
        let pv = p.v;
        let startX = p.x + k * p.r * p.vx / pv;
        let startY = p.y + k * p.r * p.vy / pv;
        

        super('rocket' + p.name,   0.001, 1,            // name, m, r
            startX,   startY, // x, y
            p.vx * k_velo,         p.vy * k_velo,       // vx, vy
            'white');  
    }

}