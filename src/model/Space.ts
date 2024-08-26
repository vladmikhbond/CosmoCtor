import Planet from './Planet.js';
import {glo} from '../globals/globals.js';

export default class Space extends EventTarget 
{
    // Метод для виклику події
    emit(eventName: string, detail: Planet|null) {
      const event = new CustomEvent<Planet|null>(eventName, {detail});
      this.dispatchEvent(event);
    }

    planets: Planet[];
    
//#region copy & restore

    // planetDatas: any;
    
    // copyPlanets() {
    //     this.planetDatas = [];
    //     for (let p of this.planets) {
    //         let copy = { ...p };
    //         this.planetDatas.push(copy);
    //     }
    // }
    
    // restorePlanets() {
    //     this.planets = [];
    //     for (let planetData of this.planetDatas) {
    //         let planet = new Planet();
    //         Object.assign(planet, planetData); 
    //         this.planets.push(planet);
    //     }
    // }

//#endregion copy & restore

    private _selectedPlanet: Planet | null = null;

    get selectedPlanet(): Planet | null {
        return this._selectedPlanet;
    }

    set selectedPlanet(planet: Planet | null) {
        this._selectedPlanet = planet;
        this.emit('selectPlanetEvent', planet);
       
    }

    constructor(...planets: Planet[]) { 
        super();
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
                if (rr) { 
                    ax += p.m * (p.x - p0.x) / rr / r;
                    ay += p.m * (p.y - p0.y) / rr / r;
                }
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

        // remove mergered planets
        this.planets = this.planets.filter(p => p.m > 0);
        if (this.selectedPlanet && this.planets.indexOf(this.selectedPlanet) === -1){
            this.selectedPlanet = null;
        }
        
        // step counter
        glo.stepsCount++;    
    }

    

    trySelectPlanet(x: number, y: number) 
    {    
        for (let p of this.planets.reverse()) {
            let dist = Math.sqrt((p.x - x)**2 + (p.y - y)**2);
            let r = Math.max(p.r, 5) / glo.scale; 
            if (dist <= r) {
                this.selectedPlanet = p;
                return true;
            }
        }
        this.selectedPlanet = null;
        return false;
    }

    removeSelectedPlanet(): boolean {
        if (this._selectedPlanet) {
            return this.removePlanet(this._selectedPlanet);
        }
        return false;
    }

    removePlanet(planet: Planet): boolean {
        let index = this.planets.indexOf(planet);
        if (index !== -1) {            
            if (planet == this._selectedPlanet) {
                this.selectedPlanet = null;                
            }
            this.planets.splice(index, 1); 
            return true;
        }
        return false;
    }

}

