import Planet from './Planet.js';
import {glo} from '../globals/globals.js';

export default class Space 
{
    planets: Planet[];

    selectedPlanet: Planet | null = null;

    constructor(...planets: Planet[]) { 
        this.planets = planets;
    }

    massCenter(): [number, number] {
        let mx = 0; 
        let my = 0;
        let m = 0;
        
        for (let p of this.planets) {
            m += p.m;
            mx += p.x * p.m;
            my += p.y * p.m;
        }
        if (m == 0)
            return [0, 0];
        return [mx / m, my / m];
    }

    step() 
    {
        // count acceleration for all planets
        for (let p0 of this.planets) {
            let ax = 0, ay = 0;
            for (let p of this.planets) {
                if (p == p0) continue;
                let rr = (p.x - p0.x)**2 + (p.y - p0.y)**2;
                let r = Math.sqrt(rr);
                ax += p.m * (p.x - p0.x)/ rr / r;
                ay += p.m * (p.y - p0.y)/ rr / r;
            }        
            p0.ax = glo.G * ax;
            p0.ay = glo.G * ay;
        }
   
        // do steps for all planets
        for (let p of this.planets) {
            p.step();
        }

        // mergers
        let planets = this.planets.sort((a:Planet, b:Planet) => b.m - a.m);

        for (let i = 0; i < planets.length - 1; i++) {
            let big = this.planets[i];
            for (let j = i + 1; j < planets.length; j++) {
                let small = this.planets[j];
                if (small.m == 0)
                    continue;
                let near = (big.x - small.x)**2 + (big.y - small.y)**2 < (big.r + small.r)**2;
                if (near) {
                    let m = big.m + small.m;
                    let vx = (big.m * big.vx + small.m * small.vx) / m;
                    let vy = (big.m * big.vy + small.m * small.vy) / m;
                    big.vx = vx;
                    big.vy = vy;
                    big.m = m;
                    big.r = Math.sqrt(big.r ** 2 + small.r ** 2);
                    small.m = 0; 
                }
            }    
        }
        this.planets = this.planets.filter(p => p.m > 0);
        
        // correct the origin
        let mc = this.massCenter();
        planets.forEach(p => {p.x -= mc[0]; p.y -= mc[1];});
        
        // incremetn step counter
        glo.stepsCount++;    
    }

    

    trySelectPlanet(x: number, y: number) 
    {    
        for (let p of this.planets) {
            let dist = Math.sqrt((p.x - x)**2 + (p.y - y)**2);
            let r = Math.max(p.r, 5); 
            if (dist <= r) {
                this.selectedPlanet = p;
                return true;
            }
        }
        this.selectedPlanet = null;
        return false;
    }

    tryRemoveSelectedPlanet() {
        if (this.selectedPlanet) {
            this.removePlanet(this.selectedPlanet);
            this.selectedPlanet = null;
        }
        return false;
    }

    removePlanet(planet: Planet) {
        let index = this.planets.indexOf(planet);
        if (index !== -1) {
            this.planets.splice(index, 1); 
            return true;
        }
    }

}

