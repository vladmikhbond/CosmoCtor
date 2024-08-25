import Planet from "./Planet.js";

export default class Rocket extends Planet
{
    constructor(velo: number, planet: Planet) 
    {   
        // e - одиничний вектор
        let [ex, ey] = planet.e();
           
        // радіус ракети
        let r = 1;
        // коорд ракети
        let x = planet.x - (planet.r + r + 1) * ey;
        let y = planet.y + (planet.r + r + 1) * ex;
        // до швидкісті докладається швидкість планети 
        velo += planet.v;
         
        super('rocket' + planet.name,   0.001, r,            // name, m, r
            x,   y, // x, y
            velo * ex,  velo * ey,       // vx, vy
            'white');  
    }

}