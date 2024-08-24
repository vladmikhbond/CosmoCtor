import Planet from "./Planet.js";

export default class Rocket extends Planet
{
    constructor(velo: number, p: Planet) 
    {   
        // e - одиничний вектор
        let ex = 1, ey = 0;
        let pv = p.v;
        if (pv) {
            ex = p.vx / pv;
            ey = p.vy / pv;
        }

        
        
        // радіус рокети
        let r = 1;
        // коорд ракети
        let x = p.x - (p.r + r + 1) * ey;
        let y = p.y + (p.r + r + 1) * ex;
        // до швидкісті докладається швидкість планети 
        velo += p.v;
         
        super('rocket' + p.name,   0.001, r,            // name, m, r
            x,   y, // x, y
            velo * ex,  velo * ey,       // vx, vy
            'white');  
    }

}