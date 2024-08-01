import {page, glo} from '../globals/globals.js';
import Planet from '../model/Planet.js';
import Space from '../model/Space.js';
import View from '../view/View.js';

export default class Controller 
{
    stepTimer = 0;
    stepsCount = 0;
    timeStamp = Date.now();
    
    constructor(public space: Space, public view: View) 
    {
        this.bindHandlers();
    }

    private bindHandlers() 
    {
        // hideButton_click
        page.hideButton.addEventListener('click', () => {
            if (page.dashboard.style.display == 'none')
                page.dashboard.style.display = 'block';
            else
            page.dashboard.style.display = 'none';

        });

        // runButton_click
        page.runButton.addEventListener('click', () => {
            if (this.stepTimer) {
                clearInterval(this.stepTimer);
                this.stepTimer = 0;
                page.runButton.innerHTML = '►'
            } else {
                this.stepTimer = setInterval(() => {
                    this.space.step();
                    this.view.draw(); 
                    
                    // speedometer
                    this.stepsCount++;
                    if (this.stepsCount % 100 == 0) {
                        let ms = Date.now() - this.timeStamp; 
                        this.timeStamp = Date.now();
                        let stepsPerSec = 100 * 1000 / ms ;
                        page.stepsPerSecSpan.innerHTML = stepsPerSec.toFixed(0);
                    }
                }, glo.STEP_PERIOD);
                page.runButton.innerHTML = '■'  
            }  
        });
        
        // trackButton_click  
        page.trackButton.addEventListener('click', () => {
            this.view.trackMode = !this.view.trackMode;
            page.trackButton.innerHTML = this.view.trackMode ? '·' : 'T';     
        });

        // saveButton_click  
        page.saveButton.addEventListener('click', () => {
            let p = this.space.selectedPlanet;
            if (p) {
                p.x = +page.xText.value;
                p.y = +page.yText.value;
                p.vx = +page.vxText.value;
                p.vy = +page.vyText.value;

                p.m = +page.massaText.value;
                p.r = +page.radiusText.value;
                p.name = page.nameText.value;
                p.color = page.colorText.value;                
            }
        });

        // plusButton_click: create new planet 
        page.plusButton.addEventListener('click', () => {
            let p = new Planet(
                page.nameText.value,
                +page.massaText.value,
                +page.radiusText.value,
                +page.xText.value,
                +page.yText.value,
                +page.vxText.value,
                +page.vyText.value,
                page.colorText.value
            );
            this.space.planets.push(p);
            this.view.draw();
        });

        // minusButton_click: remove selected planet
        page.minusButton.addEventListener('click', () => {        
            if (this.space.tryRemoveSelectedPlanet()) {
                this.view.draw();
            }
        });

        // canvas_mousedown: select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            let w = page.canvas.width / 2, h = page.canvas.height / 2;
            let x = e.offsetX - w, y = - e.offsetY + h;
            this.space.trySelectPlanet(x, y);
            this.view.draw();
        });
        
        // saveSceneButton_click: save planets array
        page.saveSceneButton.addEventListener('click', () => { 
            let json = JSON.stringify(this.space.planets);       
            page.sceneArea.innerHTML = json;
        });

        // loadSceneButton_click: load planets array
        page.loadSceneButton.addEventListener('click', () => { 
            let json = page.sceneArea.value;      
            this.space.planets = JSON.parse(json);
            this.view.draw();
        });

        
    } 
    

   
}
