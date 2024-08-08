import Planet from "./Planet.js";
import Space from "./Space.js";

export default class Nebula
{

     
    constructor(space: Space, n: number) 
    { 
        let planet = space.selectedPlanet;
        
        if (!planet) 
            return;
        let r = planet.r / Math.sqrt(n);
        let m = planet.m / 100;
        let nebulaR = planet.r * 3 * 10;
        for (let i = 0; i < n; i++) {
            let x = planet.x + Math.random() * 2 * nebulaR - nebulaR;
            let y = planet.y + Math.random() * 2 * nebulaR - nebulaR;
            let vx = Math.random() * 2 - 1;
            let vy = Math.random() * 2 - 1;
            let q = new Planet("", m, r, x, y, vx, vy, planet.color );
            space.planets.push(q);
        }
        space.tryRemoveSelectedPlanet();
    }

}