import Planet from './Planet.js';
import {glo} from '../globals/globals.js';
import Rocket from './Rocket.js';
import Nebula from './Nebula.js';
import { Starter, StarterKind } from './Starter.js';

export default class Space extends EventTarget 
{

    // Метод для виклику події 'selectPlanetEvent'
    //
    emitSelectPlanetEvent(detail: any) {
      const event = new CustomEvent<Planet|null>('selectPlanetEvent', {detail});
      this.dispatchEvent(event);
    }

    // Метод для виклику події 'mergePlanetEvent'
    //
    mergePlanetEvent(detail: any) {
        const event = new CustomEvent<Planet>('mergePlanetEvent', {detail});
        this.dispatchEvent(event);
    }
  
    planets: Planet[];

    starters: Starter[] = [];

    private _selectedPlanet: Planet | null = null;

    get selectedPlanet(): Planet | null {
        return this._selectedPlanet;
    }

    set selectedPlanet(planet: Planet | null) {
        this._selectedPlanet = planet;
        this.emitSelectPlanetEvent(planet);       
    }

    planetByName(name: string): Planet | null {
        let filtered = this.planets.filter(p => p.name == name);
        return filtered.length == 0 ? null : filtered[0];
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
                if (p == p0) {
                    continue;
                }
                // рідна планета не впливає на ракету
                if (p0 instanceof Rocket && p0.native === p){
                    continue;
                }                   
                let rr = (p.x - p0.x)**2 + (p.y - p0.y)**2;
                let rrr = Math.sqrt(rr) * rr;
                if (rr) { 
                    ax += p.m * (p.x - p0.x) / rrr;
                    ay += p.m * (p.y - p0.y) / rrr;
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

                // ракета і її рідна планета
                if (small instanceof Rocket && small.native === big){
                    continue;
                }                   

                if (small.m == 0)
                    continue;
                let near = (big.x - small.x)**2 + (big.y - small.y)**2 < (big.r + small.r)**2;
                if (near) {
                    let m = big.m + small.m;
                    let vx = (big.m * big.vx + small.m * small.vx) / m;
                    let vy = (big.m * big.vy + small.m * small.vy) / m;

                    let x = (big.m * big.x + small.m * small.x) / m;
                    let y = (big.m * big.y + small.m * small.y) / m;

                    big.m = m;
                    big.r = Math.sqrt(big.r ** 2 + small.r ** 2);
                    big.vx = vx;
                    big.vy = vy;
                    big.x = x;
                    big.y = y;

                    small.m = 0; 
                    this.mergePlanetEvent(big); 
                }
            }    
        }

        // remove mergered planets
        this.planets = this.planets.filter(p => p.m > 0);
        if (this.selectedPlanet && this.planets.indexOf(this.selectedPlanet) === -1){
            this.selectedPlanet = null;
        }
        
        // check starters 
        for (let starter of this.starters) {

            let planet = this.planetByName(starter.planetName);

            if (starter.startStep == glo.stepsCount && planet) {          
                if (starter.kind == StarterKind.Rocket) {
                    // rocket
                    let rocket = new Rocket(starter.velo, planet);
                    this.planets.push(rocket);
                } else if (starter.kind == StarterKind.Nebula) {
                    // nebula
                    new Nebula(starter.count, starter.size, starter.velo, planet, this); 
                }
                starter.kind = StarterKind.Empty; 
            }
            
        }
        // remove used starters
        this.starters = this.starters.filter(s => s.kind != StarterKind.Empty);
        // increment step counter
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

    graviTension(point: {x: number, y: number}): [ax: number, ay: number] {
        let ax = 0, ay = 0;
        for (let planet of this.planets) {  
            let rr = (planet.x - point.x)**2 + (planet.y - point.y)**2;
            let rrr = Math.sqrt(rr) * rr;

            if (rr) { 
                ax += planet.m * (planet.x - point.x) / rrr;
                ay += planet.m * (planet.y - point.y) / rrr;
            }
        }        
        ax = glo.G * ax;
        ay = glo.G * ay;
        return [ax, ay];
    }

}

