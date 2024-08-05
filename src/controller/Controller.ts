import {page, glo} from '../globals/globals.js';
import Planet from '../model/Planet.js';
import Space from '../model/Space.js';
import View from '../view/View.js';

export default class Controller 
{
    stepTimer = 0;

    timeStamp = Date.now();
    
    constructor(public space: Space, public view: View) 
    {
        this.bindHandlers();
        this.bindDashboardHandlers();
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

        //#region planet selection and dragging

        let dragged = false; 

        // canvas_mousedown: select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            let x = (e.offsetX - page.canvas.width / 2) / glo.SCOPE;
            let y = -(e.offsetY - page.canvas.height / 2) / glo.SCOPE;

            dragged = this.space.trySelectPlanet(x, y);
            this.view.draw();
        });
        
        page.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if (dragged) {
                let x = (e.offsetX - page.canvas.width / 2) / glo.SCOPE;
                let y = -(e.offsetY - page.canvas.height / 2) / glo.SCOPE;
                this.space.selectedPlanet!.x = x;
                this.space.selectedPlanet!.y = y;
                this.view.draw();                
            }
        });
        
        page.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            dragged = false;
        });
        
        //#endregion


        // saveSceneButton_click: save planets array
        page.saveSceneButton.addEventListener('click', () => {
            let objects = this.space.planets.map(p => { 
                return {name:p.name, m:p.m, r:p.r, x:p.x, y:p.y, vx:p.vx, vy:p.vy, color:p.color};
            });
            let json = JSON.stringify(objects);       
            page.sceneArea.innerHTML = json;
        });

        // loadSceneButton_click: load planets array
        page.loadSceneButton.addEventListener('click', () => { 
            let json = page.sceneArea.value;      
            let objects: [] = JSON.parse(json);
            
            this.space.planets = objects.map(o => {
                let p = new Planet(); 
                Object.assign(p, o); 
                return p;})             
            this.view.draw();
        });
        
    } 
    
    private bindDashboardHandlers() 
    {
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
                    glo.stepsCount++;
                    if (glo.stepsCount % 100 == 0) {
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
            page.trackButton.innerHTML = this.view.trackMode ? '●' : 'T'; 
            this.view.draw();    
        });


        // plusButton_click: create new planet 
        page.plusButton.addEventListener('click', () => {
            // get standard or copy selected planet
            let planet = this.space.selectedPlanet ? 
                <Planet>{ ...this.space.selectedPlanet } :
                Planet.getStandardPlanet();
            planet.y += page.canvas.height / 4 * glo.SCOPE;

            this.space.planets.push(planet);
            this.space.selectedPlanet = planet;            
            this.view.draw();
        });

        // minusButton_click: remove selected planet
        page.minusButton.addEventListener('click', () => {        
            if (this.space.tryRemoveSelectedPlanet()) {
                this.view.draw();
            }
        });

        //
        const handler = () => { Controller.applyParamsHandler(this); };

        // applyButton_click  
        page.applyButton.addEventListener('click', handler);
        // textfields_changed
        page.xText.addEventListener('change', handler);
        page.yText.addEventListener('change', handler);
        page.vxText.addEventListener('change', handler);
        page.vyText.addEventListener('change', handler);
        page.nameText.addEventListener('change', handler);
        page.colorText.addEventListener('change', handler);
        page.massaText.addEventListener('change', handler);
        page.radiusText.addEventListener('change', handler);

        // telescope
        page.scopeRange.addEventListener('change', () => {
            glo.SCOPE = 1.2 ** page.scopeRange.valueAsNumber;
            this.view.draw();
        });
    }

    static applyParamsHandler(me: Controller) {
        let planet = me.space.selectedPlanet;
        if (planet) {
            planet.x = +page.xText.value;
            planet.y = +page.yText.value;
            planet.vx = +page.vxText.value;
            planet.vy = +page.vyText.value;

            planet.m = +page.massaText.value;
            planet.r = +page.radiusText.value;
            planet.name = page.nameText.value;
            planet.color = page.colorText.value;
            me.view.draw();              
        }
    }
   

}
