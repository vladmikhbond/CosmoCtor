import {glo, page} from '../globals/globals.js';
import Planet from '../model/Planet.js';
import Rocket from '../model/Rocket.js';
import Space from '../model/Space.js';

export default class View 
{
    
    ctx: CanvasRenderingContext2D;
    // tracks
    trackMode = false; 

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
        ctx.restore();

        // // present selected planet on the planetboard
        // if (this.space.selectedPlanet  ) {
        //     this.displaySelectedPlanet();   
        // }
        
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

        // body        
        if (planet instanceof Rocket) {
            const LEN = 2;
            let points = planet.track.points;
            if (points.length > LEN) {
                let point = points[points.length - LEN];
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(planet.x, planet.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }           
        } else {
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

    drawXY(point: { x: number; y: number; }) {
        let left = 310;
        let top = 5;
        
        this.ctx.fillStyle = 'darkblue';
        this.ctx.fillRect(left, top, 150, 20);
        
        this.ctx.font = '14px';
        this.ctx.fillStyle = 'lightgray';
        this.ctx.fillText(`x: ${point.x.toFixed(2)}   y: ${point.y.toFixed(2)}`, left + 5, top + 15);
    }

    // display to panelBoard
    //
    displaySelectedPlanet() {
        let planet = this.space.selectedPlanet!;

        page.xText.value = planet.x.toFixed(5);
        page.yText.value = planet.y.toFixed(5);
        page.vxText.value = planet.vx.toFixed(5);
        page.vyText.value = planet.vy.toFixed(5);

        page.nameText.value = planet.name;
        page.colorText.value = planet.color;
        page.massaText.value = planet.m.toFixed(3);
        page.radiusText.value = planet.r.toFixed(0);       
    }

    // display the footer
    //
    static DISPLAY_INTERVAL = 500 / glo.STEP_PERIOD | 0; // to display 2 times per second
    timeStamp = Date.now();

    displayFooter() 
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

}
