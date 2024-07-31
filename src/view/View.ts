import {page} from '../globals/globals.js';
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
        if (!this.trackMode) {
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(0, 0, page.canvas.width, page.canvas.height);
        }

        ctx.save();
        ctx.translate(page.canvas.width / 2, page.canvas.height / 2);
        ctx.scale(1, -1);

        // axes
        ctx.strokeStyle = 'gray';
        ctx.beginPath();
        ctx.moveTo(-page.canvas.width, 0);
        ctx.lineTo(page.canvas.width, 0);
        ctx.moveTo(0, -page.canvas.height);
        ctx.lineTo(0, page.canvas.height);
        ctx.stroke();
        
        // all planets
        for (const planet of space.planets) {    
            this.drawPlanet(planet);
        }
        // selected planet
        if (space.selectedPlanet) {
            this.drawPlanet(space.selectedPlanet, true); 
            this.displaySelectedPlanet();   
        }
        ctx.restore();
    }

    displaySelectedPlanet() {
        let p = this.space.selectedPlanet!;
        page.xText.value = p.x.toFixed(5);
        page.yText.value = p.y.toFixed(5);
        page.vxText.value = p.vx.toFixed(5);
        page.vyText.value = p.vy.toFixed(5);

        page.nameSpan.innerHTML = p.name;
        page.nameText.value = p.name;
        page.colorText.value = p.color;
        page.massaText.value = p.m.toFixed(0);
        page.radiusText.value = p.r.toFixed(0);       
    }


    drawPlanet(p: Planet, selected = false) {
        this.ctx.fillStyle = selected ? "red" : p.color;
        this.ctx.beginPath();        
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);   
        this.ctx.fill();
    } 



}
