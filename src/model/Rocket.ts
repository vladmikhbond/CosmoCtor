import Planet from "./Planet.js";

export default class Rocket extends Planet
{
    native: Planet;

    constructor(velo: number, planet: Planet) 
    {   
        // e - одиничний вектор швидкості планети
        let [ex, ey] = planet.e();
           
        // радіус ракети
        let r = 1;
        // коорд ракети
        let x = planet.x; 
        let y = planet.y;
        // до швидкості докладається швидкість планети 
        velo += planet.v;
        

        super('_r_' + planet.name,   0.000001, r,            // name, m, r
            x,   y, // x, y
            velo * ex,  velo * ey,       // vx, vy
            'white');

        this.native = planet;
    }

}