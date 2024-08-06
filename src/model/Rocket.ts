import Planet from "./Planet.js";

export default class Rocket extends Planet
{
    constructor(deltaV: number, p: Planet) 
    { 
        let k_velo = 1 + deltaV;
        let k_dist = deltaV > 0 ? 5 : -5;
        
        super('rocket' + p.name, 0.001, 1,            // name, m, r
            p.x + k_dist * p.vx, p.y + k_dist * p.vy, // x, y
            p.vx * k_velo, p.vy * k_velo,             // x, vy
            'white');  
    }

}