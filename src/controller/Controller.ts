import { page, glo } from '../globals/globals.js';
import {data} from '../data/data.js';
import { serialization, deserialization, TaskData} from '../serialize/serialize.js';

import Nebula from '../model/Nebula.js';
import Planet from '../model/Planet.js';
import Rocket from '../model/Rocket.js';
import Space from '../model/Space.js';
import View from '../view/View.js';
import { Starter, StarterKind } from '../model/Starter.js';

export default class Controller 
{
    stepTimer = 0;

    timeStamp = Date.now();

    constructor(public space: Space, public view: View) {
        this.bindButtonClickEvents();
        this.bindCanvasMouseEvents();
        this.bindTaskDivMouseEvents();
        this.bindChangeEvents();
        this.bindTaskEvents();
        this.bindStarterEvents()
        this.bindCustomEvents();
    }

    private bindCustomEvents() {
        this.space.addEventListener('selectPlanetEvent', e => {
            let planet = <Planet|null>(<CustomEvent>e).detail;
            if (planet) {
                this.view.displaySelectedPlanetParams(); 
                page.planetBoard.style.display = 'block';
            } else {
                page.planetBoard.style.display = 'none';
                page.nebulaBoard.style.display = 'none';
            }
        })
        
        this.space.addEventListener('mergePlanetEvent', e => {            
            let planet = <Planet>(<CustomEvent>e).detail;
            if (planet.name[0] != '_') {
                this.view.anime(planet);
            }
            
        })

    }


    private bindButtonClickEvents() 
    {
        // hideButton
        page.hideButton.addEventListener('click', () => {
            if (page.dashboard.style.display == 'none')
                page.dashboard.style.display = 'block';
            else
                page.dashboard.style.display = 'none';
        });

        // runButton_click
        page.runButton.addEventListener('click', () => {
            if (!this.stepTimer) {
                page.saveSceneButton.dispatchEvent(new Event("click"));
                this.startTimer();
            } else {
                this.stopTimer();    
            }
        });

        // stepButton_click
        page.stepButton.addEventListener('click', () => {
            this.step();
            this.view.displayInfo();
        });

        // trackButton_click  
        page.trackButton.addEventListener('click', () => {
            this.view.trackMode = !this.view.trackMode;
            page.trackButton.innerHTML = this.view.trackMode ? '●' : 'O';
            this.view.draw();
        });

        // saveSceneButton: save space.planets
        page.saveSceneButton.addEventListener('click', () => {
            let json = serialization(this.space);
            page.sceneArea.innerHTML = json;
        });

        // loadSceneButton: load space.planets
        page.loadSceneButton.addEventListener('click', () => {
            this.clearAll(page.sceneArea.value);
        });

        // Get standard or copy selected planet
        //
        page.planetButton.addEventListener('click', () => {
            
            let planet = new Planet();
            if (this.space.selectedPlanet) {                
                Object.assign(planet, this.space.selectedPlanet);
                planet.x = this.space.selectedPlanet.x - 50;
                planet.y = this.space.selectedPlanet.y + 50;                
            }
            this.space.planets.push(planet);
            this.space.selectedPlanet = planet;
            this.view.draw();          
        });


        // delButton_click: remove selected planet
        page.delButton.addEventListener('click', () => {
            this.space.removeSelectedPlanet();
            this.view.draw();
        });

    }
    
    private bindStarterEvents() {       

        page.rocketButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) { 
                page.rocketBoard.style.display='block';                    
                this.view.draw();
            }
        
        });

        page.nebulaButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) {  
                page.nebulaBoard.style.display='block';
                this.view.draw();
            } 
        });
        

        page.okButton1.addEventListener('click', () => {

            this.space.starters.push({
                kind:  StarterKind.Rocket, 
                velo: +page.velo.value, 
                count: 0, 
                size:0,
                startStep: +page.interval1.value + glo.stepsCount, 
                planetName: this.space.selectedPlanet!.name
            });
            page.rocketBoard.style.display = 'none';
        });

        page.okButton2.addEventListener('click', () => {
            this.space.starters.push({
                kind: StarterKind.Nebula,
                velo: 0, 
                count: +page.count.value, 
                size: +page.size.value, 
                startStep: +page.interval2.value + glo.stepsCount, 
                planetName: this.space.selectedPlanet!.name
            });
            page.nebulaBoard.style.display = 'none';
        });


        page.cancelButton1.addEventListener('click', () => {
            page.rocketBoard.style.display = 'none';
        });

        page.cancelButton2.addEventListener('click', () => {
            page.nebulaBoard.style.display = 'none';
        });

    }

    private bindCanvasMouseEvents() {

        let isPlanetDragging = false;
        let cursor: {x: number, y: number} | null = null;
        
        // canvas_mousedown: select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = glo.retransformXY(e.offsetX, e.offsetY);
            isPlanetDragging = this.space.trySelectPlanet(cursor.x, cursor.y);
            this.view.draw();
            this.view.displaySelectedPlanetParams();
        });

        page.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            let point = glo.retransformXY(e.offsetX, e.offsetY); 
            if (isPlanetDragging) 
            { 
                // dragging a planet                             
                this.space.selectedPlanet!.x += point.x - cursor!.x;
                this.space.selectedPlanet!.y += point.y - cursor!.y;
                cursor = point;
                this.view.draw();
                this.view.displaySelectedPlanetParams();

            } 
            else if (cursor != null) 
            {
                // shifting the space
                glo.shiftX += (point.x - cursor.x) * glo.scale; 
                glo.shiftY -= (point.y - cursor.y) * glo.scale;
                cursor = point;
                this.view.draw();
            }

            // draw cursor coords
            if (!this.stepTimer) {

                let [gx, gy] = this.space.graviTension(point);
                this.view.drawCursorCoords(point, gx, gy);

            }
        });

        page.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            isPlanetDragging = false;
            cursor = null;
        });
   
    }

    private bindTaskDivMouseEvents() {

        let cursor: {x: number, y: number} | null = null;
   
        page.taskDiv.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = {x: e.screenX, y: e.screenY};
        });

        page.taskDiv.addEventListener('mousemove', (e: MouseEvent) => { 
            if (cursor) {                              
                let dx = e.screenX - cursor.x;
                let dy = e.screenY - cursor.y;
                let style = window.getComputedStyle(page.taskDiv);

                let left = parseFloat(style.left) + dx;
                page.taskDiv.style.left = left + 'px';

                let top = parseFloat(style.top) + dy;
                page.taskDiv.style.top = top + 'px';

                cursor = {x: e.screenX, y: e.screenY};
            }    
        });

        page.taskDiv.addEventListener('mouseup', (e: MouseEvent) => {
            cursor = null;
        });

    }

    private bindChangeEvents() {
        // telescope
        page.scopeRange.addEventListener('change', () => {
            glo.scale = 2**(page.scopeRange.valueAsNumber/2);
            this.view.draw();
        });


        // textfields_changed
        const handler = () => { Controller.applyParamsHandler(this); };

        page.xText.addEventListener('change', handler);
        page.yText.addEventListener('change', handler);
        page.vxText.addEventListener('change', handler);
        page.vyText.addEventListener('change', handler);
        page.nameText.addEventListener('change', handler);
        page.colorText.addEventListener('change', handler);
        page.massaText.addEventListener('change', handler);
        page.radiusText.addEventListener('change', handler);

        // canvas_keydown
        page.canvas.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Delete':
                    this.space.removeSelectedPlanet()
                    this.view.draw();               
                    break;
            };
        });
    }

    private bindTaskEvents()  
    {
        let final: string;
        
        page.openHelpButton.addEventListener('click', () => {
            page.helpDiv.style.display='block'; 
            page.openHelpButton.style.display='none';
        });

        page.openSolvButton.addEventListener('click', () => {
            page.solvDiv.style.display='block'; 
            page.openSolvButton.style.display='none';
            this.clearAll(final);          
        });

        page.closeTaskButton.addEventListener('click', () => {
            page.taskDiv.style.display = 'none';
        });

        // Створює кнопки завдання і саджає не кожну свій обробник.
        for (let task of data) {
            let menuButton = document.createElement('Button');
            menuButton.style.backgroundImage = `url('/assets/${task.id}.png')`;
            menuButton.title = task.title;
            
            // Обробник натискання на кнопку завдання
            menuButton.addEventListener('click', () => {
                this.clearAll(task.init);
                final = task.final;

                page.openHelpButton.style.display = page.openSolvButton.style.display = 'block';
                page.taskDiv.style.display = 'block';
                page.helpDiv.style.display = 'none';
                page.solvDiv.style.display = 'none';

                (<HTMLDivElement>page.condDiv.firstElementChild).innerHTML = task.cond;
                (<HTMLDivElement>page.helpDiv.firstElementChild).innerHTML = task.help;
                (<HTMLDivElement>page.solvDiv.firstElementChild).innerHTML = task.solv;

                // Математичні формули у динамічному контенті
                (new Function("","MathJax.typeset()"))();            
            })

            page.menuSpan.append(menuButton); 

        }
    }

    clearAll(data: string) {
        this.space.planets = [];
        this.space.starters = [];
        if (data) {
            let o = deserialization(data);
            this.space.planets = o.planets;
            this.space.starters = o.starters;
        }
        this.stopTimer();
        glo.stepsCount = 0;
        this.view.draw();
        this.view.displayInfo();
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

    private step() {
        this.space.step();
        this.view.draw();
        // display info 
        if (glo.stepsCount % View.DISPLAY_INTERVAL == 0) {
            this.view.displayInfo();
            this.view.displaySelectedPlanetParams();
        }
    }

    private startTimer() {
        this.stepTimer = setInterval(() => {
            this.step();
        }, glo.STEP_PERIOD);
        page.runButton.innerHTML = '■';
    }

    private stopTimer() {
        clearInterval(this.stepTimer);
        this.stepTimer = 0;
        page.runButton.innerHTML = '►';
        this.view.displayInfo();
    }


 
}



