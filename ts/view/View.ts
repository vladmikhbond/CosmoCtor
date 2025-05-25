import {glo, page} from '../globals/globals.js';
import Planet from '../model/Planet.js';
import Rocket from '../model/Rocket.js';
import Space from '../model/Space.js';

export default class View 
{
    private static ANIME_DURATION = 300;
    private static MAX_TRACK_NOMBER = 100;
    static DISPLAY_INTERVAL = 500 / glo.STEP_PERIOD | 0; //  = 2 times/sec

    anime (planet: Planet) {
        if (planet.color == 'red')
            return;
        let oldColor = planet.color;
        planet.color = 'red';
        setTimeout(() => {
            planet.color = oldColor;
        }, View.ANIME_DURATION); 
        
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
        for (let i = 0; i < space.planets.length; i++) {
            const planet = space.planets[i];
            if (planet === space.selectedPlanet) {
                this.drawSelectedPlanet(planet);
            } else {
                let withTrack = this.trackMode && i < View.MAX_TRACK_NOMBER; 
                this.drawPlanet(planet, false, withTrack);
            }
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

    drawPlanet(planet: Planet, withVelo: boolean = false, withTrack: boolean = false) {
        const ctx = this.ctx;
        ctx.fillStyle = planet.color; 
        ctx.strokeStyle = planet.color;

        // track
        if (withTrack) 
        {
            ctx.lineWidth = 0.5/glo.scale;
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
            // щоб планета не виглядала дуже малою
            let r = planet.r > 1 ? planet.r : 1;
            r /= glo.scale**0.5;

            ctx.beginPath();
            ctx.arc(planet.x, planet.y, r, 0, Math.PI * 2);
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
        // gray rectangle
        this.ctx.strokeStyle = 'gray';
        let r = p.r + 5;
        this.ctx.strokeRect(p.x - r, p.y - r, r * 2, r * 2)
        // planet
        this.drawPlanet(p, true, this.trackMode);        
    } 

    drawCursorCoords(point: {x: number; y: number}, gx: number, gy: number) {
        let left = 0;
        let top = 100;
        this.ctx.fillStyle = 'darkblue';    
        this.ctx.font = '14px';
        this.ctx.fillStyle = 'lightgray';
        let g = Math.sqrt(gx**2 + gy**2);  
        this.ctx.fillText(`gx: ${gx.toFixed(4)}   gy: ${gy.toFixed(4)}  g: ${g.toFixed(4)}`, left + 5, top + 15);
        this.ctx.fillText(`x: ${point.x.toFixed(2)}   y: ${point.y.toFixed(2)}`, left + 5, top + 25);
    }
    
    // line from mouse cursor (NOT USED)
    //
    drawGraviTension(point: { x: number; y: number; }, gx: number, gy: number) {
        const K = 100;
        // transform
        this.ctx.save();
        this.ctx.translate(glo.shiftX, glo.shiftY);
        this.ctx.scale(glo.scale, -glo.scale);
        
        this.ctx.beginPath()
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.x + K*gx, point.y + K*gy);    
        this.ctx.stroke();
        
        this.ctx.restore();
    }
   
    // display info
    //
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
        page.planetsCountSpan.innerHTML = planetsCount.toString();      
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
