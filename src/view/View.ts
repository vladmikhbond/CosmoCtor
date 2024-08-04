import {glo, page} from '../globals/globals.js';
import Planet from '../model/Planet.js';
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
        // track mode
        if (!this.trackMode) {
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(0, 0, page.canvas.width, page.canvas.height);
        }

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
        ctx.translate(page.canvas.width/2, page.canvas.height/2);
        ctx.scale(glo.SCOPE, -glo.SCOPE);

    
        // all planets
        for (const planet of space.planets) { 
            if (planet != space.selectedPlanet)   
                this.drawPlanet(planet);
            else
                this.drawSelectedPlanet(planet);
        }
        ctx.restore();
        // selected planet on the dashboard
        if (space.selectedPlanet) {
            this.displaySelectedPlanet();   
        }
        
    }

    // fill dashboard fields
    //
    private displaySelectedPlanet() {
        let planet = this.space.selectedPlanet!;

        page.xText.value = planet.x.toFixed(5);
        page.yText.value = planet.y.toFixed(5);
        page.vxText.value = planet.vx.toFixed(5);
        page.vyText.value = planet.vy.toFixed(5);

        page.nameSpan.innerHTML = planet.name;
        page.nameText.value = planet.name;
        page.colorText.value = planet.color;
        page.massaText.value = planet.m.toFixed(0);
        page.radiusText.value = planet.r.toFixed(0);       
    }


    drawPlanet(p: Planet, withVelo: boolean = false) {
        this.ctx.fillStyle = p.color;
        if (this.trackMode) 
        {
            this.ctx.fillRect(p.x, p.y, 1, 1);
            return;
        }
        // planet body
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fill();
        // planet velocity
        if (withVelo) {
            const k = 10;
            this.ctx.strokeStyle = p.color;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + k * p.vx, p.y + k * p.vy);
            this.ctx.stroke();
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



}
