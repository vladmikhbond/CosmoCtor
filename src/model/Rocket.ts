import Planet from "./Planet.js";

export default class Rocket extends Planet
{
    constructor(k_velo: number, p: Planet) 
    { 
        let k_dist = k_velo > 0 ? 5 : -5;
        
        super('rocket' + p.name,   0.001, 1,            // name, m, r
            p.x + k_dist * p.vx,   p.y + k_dist * p.vy, // x, y
            p.vx * k_velo,         p.vy * k_velo,       // vx, vy
            'white');  
    }

}