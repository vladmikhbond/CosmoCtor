import Planet from './Planet.js';

export default class Space 
{
    static G = 0.001;

    planets: Planet[];



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
            p0.ax = Space.G * ax;
            p0.ay = Space.G * ay;
        }
        //
        for (let p of this.planets) {
            p.vx += p.ax;
            p.vy += p.ay;
            p.x += p.vx;
            p.y += p.vy;             
        }    
    }

    selectedPlanet: Planet | null = null;

    trySelectPlanet(x: number, y: number) {
        for (let p of this.planets) {
            let dd = (p.x - x)**2 + (p.y - y)**2; 
            if (dd < 16) {
                this.selectedPlanet = p;
                return true;
            }
        }
        this.selectedPlanet = null;
        return false;
    }


}

