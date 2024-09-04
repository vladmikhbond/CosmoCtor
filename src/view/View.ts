import {glo, page} from '../globals/globals.js';
import Planet from '../model/Planet.js';
import Rocket from '../model/Rocket.js';
import Space from '../model/Space.js';

export default class View 
{
    anime (planet: Planet) {
        
        let oldColor = planet.color;
        planet.color = 'red';
        setTimeout(() => {
            planet.color = oldColor;
        }, 300); 
        
    }
    
    ctx: CanvasRenderingContext2D;
    // tracks
    trackMode = true; 

    constructor(public space: Space) {   
        this.ctx = page.canvas.getContext("2d")!;                 
    }

    draw() {   
        const ctx = this.ctx;
        const space = this.space;

        ctx.fillStyle = 'darkblue';
        ctx.fillRect(0, 0, page.canvas.width, page.canvas.height);

        // axes
        ctx.strokeStyle = 'gray';
        let h = page.canvas.height / 2, w = page.canvas.width / 2;
        ctx.beginPath();
        // hor
        ctx.moveTo(0, h);
        ctx.lineTo(2*w, h);
        // ver
        ctx.moveTo(w, 0);
        ctx.lineTo(w, 2*h);
        ctx.stroke(); 

        // transform
        ctx.save();
        ctx.translate(glo.shiftX, glo.shiftY);
        ctx.scale(glo.scale, -glo.scale);
    
        // all planets
        for (const planet of space.planets) { 
            if (planet === space.selectedPlanet)   
                this.drawSelectedPlanet(planet);
            else
                this.drawPlanet(planet);
        }

        // center of mass
        if (this.trackMode) {
            ctx.fillStyle = 'red';
            let [cx, cy] = this.space.massCenter()
            ctx.fillRect(cx-3, cy-1, 6, 2);
            ctx.fillRect(cx-1, cy-3, 2, 6);
        }

        ctx.restore();        
    }

    drawPlanet(planet: Planet, withVelo: boolean = false) {
        const ctx = this.ctx;
        ctx.fillStyle = planet.color; 
        ctx.strokeStyle = planet.color;

        // track
        if (this.trackMode) 
        {
            ctx.lineWidth = 1;
            ctx.beginPath();
            let len = planet.track.points.length;
            let point = planet.track.points[len - 1];
            ctx.moveTo(point.x, point.y);
            for (let i = len - 1; i > 0; i--) {
                let point = planet.track.points[i];
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        }

        // rocket
        if (planet instanceof Rocket) 
        {
            const ROCKET_LEN = 9;
            let e = planet.e();
            let x = planet.x - ROCKET_LEN * e[0];
            let y = planet.y - ROCKET_LEN * e[1];
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(planet.x, planet.y);
            ctx.lineTo(x, y);
            ctx.stroke();        
        } 
        else  // planet
        {            
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
            ctx.fill();
        }
    
        // velocity
        if (withVelo) {
            const k = 10;
            ctx.lineWidth = 1;           
            ctx.beginPath();
            ctx.moveTo(planet.x, planet.y);
            ctx.lineTo(planet.x + k * planet.vx, planet.y + k * planet.vy);
            ctx.stroke();
        }
    } 

    drawSelectedPlanet(p: Planet) {
        // gray rect
        this.ctx.strokeStyle = 'gray';
        let r = p.r + 5;
        this.ctx.strokeRect(p.x - r, p.y - r, r * 2, r * 2)
        // planet
        this.drawPlanet(p, true);        
    } 

    drawCursorCoords(point: { x: number; y: number; }) {
        let left = 310;
        let top = 5;
        
        this.ctx.fillStyle = 'darkblue';
        this.ctx.fillRect(left, top, 150, 20);
        
        this.ctx.font = '14px';
        this.ctx.fillStyle = 'lightgray';
        this.ctx.fillText(`x: ${point.x.toFixed(2)}   y: ${point.y.toFixed(2)}`, left + 5, top + 15);
    }

   
    // display the info
    //
    static DISPLAY_INTERVAL = 500 / glo.STEP_PERIOD | 0; // 2 times per second
    timeStamp = Date.now();

    displayInfo() 
    {
        let planetsCount = this.space.planets.length;
        // speedometer
        let milliseconds = Date.now() - this.timeStamp;
        this.timeStamp = Date.now();
        let stepsPerSec = View.DISPLAY_INTERVAL * 1000 / milliseconds;
        // display
        page.stepsPerSecSpan.innerHTML = stepsPerSec.toFixed(0);
        page.stepsCountSpan.innerHTML = glo.stepsCount.toString(); 
        page.planetsCount.innerHTML = planetsCount.toString();      
    }

    // display to panelBoard
    //
    displaySelectedPlanetParams() {
        let planet = this.space.selectedPlanet;
        if (planet) {
            page.xText.value = planet.x.toFixed(5);
            page.yText.value = planet.y.toFixed(5);
            page.vxText.value = planet.vx.toFixed(5);
            page.vyText.value = planet.vy.toFixed(5);

            page.nameText.value = planet.name;
            page.colorText.value = planet.color;
            page.massaText.value = planet.m.toFixed(3);
            page.radiusText.value = planet.r.toFixed(0);            
        }

       
    }

}
