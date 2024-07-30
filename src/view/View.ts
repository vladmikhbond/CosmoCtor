import Planet from '../model/Planet.js';
import Space from '../model/Space.js';

export default class View 
{

    canvasElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;


    constructor(public space: Space) {   
        this.canvasElement = <HTMLCanvasElement>document.getElementById('canvas')!;
        this.ctx = this.canvasElement.getContext("2d")!;                 
    }

    draw() {   
        const ctx = this.ctx;
        const space = this.space;
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        ctx.save();
        ctx.translate(this.canvasElement.width / 2, this.canvasElement.height / 2);
        ctx.scale(1, -1);
        for (const planet of space.planets) {    
            this.drawPlanet(planet);
        }      
        ctx.restore();
    }


    drawPlanet(p: Planet) {
        this.ctx.fillStyle = "red";

        this.ctx.beginPath();
        
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    
        // velocity arrow
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.vx, p.y + p.vy);
      
        this.ctx.stroke();
    } 



}
