import Planet from './Planet.js';
import {glo} from '../globals/globals.js';

export default class Space 
{
    planets: Planet[];

    selectedPlanet: Planet | null = null;

    constructor(...planets: Planet[]) { 
        this.planets = planets;
    }

    step() {
        // count acceleration for each planet
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
        //
        for (let p of this.planets) {
            p.vx += p.ax;
            p.vy += p.ay;
            p.x += p.vx;
            p.y += p.vy;             
        }    
    }

    

    trySelectPlanet(x: number, y: number) 
    {    
        for (let p of this.planets) {
            let dist = Math.sqrt((p.x - x)**2 + (p.y - y)**2); 
            if (dist < p.r) {
                this.selectedPlanet = p;
                return true;
            }
        }
        this.selectedPlanet = null;
        return false;
    }

    tryRemoveSelectedPlanet() {
        if (this.selectedPlanet) {
            let index = this.planets.indexOf(this.selectedPlanet);
            if (index !== -1) {
                this.planets.splice(index, 1);
                this.selectedPlanet = null;
                return true;
            }
        }
        return false;
    }
}

