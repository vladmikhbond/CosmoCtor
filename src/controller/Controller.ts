import { page, glo } from '../globals/globals.js';
import {data} from '../data/data.js';
import { serialization, deserialization, planetsFromData} from '../serialize/serialize.js';

import Nebula from '../model/Nebula.js';
import Planet from '../model/Planet.js';
import Rocket from '../model/Rocket.js';
import Space from '../model/Space.js';
import View from '../view/View.js';

export default class Controller {
        stepTimer = 0;

    timeStamp = Date.now();

    constructor(public space: Space, public view: View) {
        this.bindClickEvents();
        this.canvasMouseEvents();
        this.taskDivMouseEvents();
        this.bindChangeEvents();
        this.bindTaskEvents();

        this.space.addEventListener('selectPlanetEvent', e => {
            let p = <Planet|null>(<CustomEvent>e).detail;
            if (p) {
                this.view.displaySelectedPlanet(); 
                page.planetBoard.style.display = 'block';
            } else {
                page.planetBoard.style.display = 'none';
                page.actionBoard.style.display = 'none';
            }
        })
        
    }

    private bindClickEvents() 
    {
        // hideButton
        page.hideButton.addEventListener('click', () => {
            if (page.dashboard.style.display == 'none')
                page.dashboard.style.display = 'block';
            else
                page.dashboard.style.display = 'none';
        });

        // saveSceneButton: save space.planets
        page.saveSceneButton.addEventListener('click', () => {
            let json = serialization(this.space.planets);
            page.sceneArea.innerHTML = json;
        });

        // loadSceneButton: load space.planets
        page.loadSceneButton.addEventListener('click', () => {
            this.space.planets = deserialization(page.sceneArea.value);
            this.stopTimer();
            this.view.draw();
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

        enum CreateMode { Planet, Rocket, Nebula };

        let mode: CreateMode = CreateMode.Planet;        

        page.rocketButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) {
                page.span1.style.display = page.field1.style.display = 'inline';
                page.span2.style.display = page.field2.style.display = 'none';
                page.span3.style.display = page.field3.style.display = 'inline';

                page.span1.innerHTML = 'Velo ';
                page.span3.innerHTML = 'Time '; 
                page.actionBoard.style.display='block';                    
                this.view.draw();
                mode = CreateMode.Rocket;
            }
        
        });

        page.nebulaButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) {
                page.span1.style.display = page.field1.style.display = 'inline';
                page.span2.style.display = page.field2.style.display = 'inline';
                page.span3.style.display = page.field3.style.display = 'inline';

                page.span1.innerHTML = 'Number ';
                page.span2.innerHTML = 'Radius '; 
                page.span3.innerHTML = 'Time&nbsp;&nbsp;';  
                page.actionBoard.style.display='block';
                this.view.draw();
                mode = CreateMode.Nebula;
            } 
        });
        
        // actionButton_click  
        page.okButton.addEventListener('click', () => {
            this.space.starters.push({
                kind: mode, 
                param1:+page.field1.value, 
                param2:+page.field2.value, 
                startStep:+page.field3.value + glo.stepsCount, 
                planet: this.space.selectedPlanet! 
            });
            page.actionBoard.style.display = 'none';
        });

        page.cancelButton.addEventListener('click', () => {
            page.actionBoard.style.display = 'none';
        });

        // delButton_click: remove selected planet
        page.delButton.addEventListener('click', () => {
            this.space.removeSelectedPlanet();
            this.view.draw();
        });

    }
    
    private canvasMouseEvents() {

        let isPlanetDragging = false;
        let cursor: {x: number, y: number} | null = null;
        
        // canvas_mousedown: select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = glo.retransformXY(e.offsetX, e.offsetY);
            isPlanetDragging = this.space.trySelectPlanet(cursor.x, cursor.y);
            this.view.draw();
            this.view.displaySelectedPlanet();
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
                this.view.displaySelectedPlanet();

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
                this.view.drawCursorCoords(point);
            }
        });

        page.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            isPlanetDragging = false;
            cursor = null;
        });
   
    }

    private taskDivMouseEvents() {

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
            glo.scale = 1.2 ** page.scopeRange.valueAsNumber;
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
        let solvPlanets: Planet[];
        
        page.openHelpButton.addEventListener('click', () => {
            page.helpDiv.style.display='block'; 
            page.openHelpButton.style.display='none';
        });

        page.openSolvButton.addEventListener('click', () => {
            page.solvDiv.style.display='block'; 
            page.openSolvButton.style.display='none';
            this.space.planets = solvPlanets;
        });

        page.closeTaskButton.addEventListener('click', () => {
            page.condDiv.style.display = 'none';
        });

        // Створює кнопки завдання і саджає не кожну свій обробник.
        for (let task of data) {
            let menuButton = document.createElement('Button');
            menuButton.style.backgroundImage = `url('/assets/${task.id}.png')`;
            menuButton.title = task.title;
            
            // Обробник натискання на кнопку завдання
            menuButton.addEventListener('click', () => {
                this.space.planets = planetsFromData(task.planets);
                solvPlanets = planetsFromData(task.solvPlanets);

                page.openHelpButton.style.display = page.openSolvButton.style.display = 'block';
                page.taskDiv.style.display = 'block';

                (<HTMLDivElement>page.condDiv.firstElementChild).innerHTML = task.cond;
                (<HTMLDivElement>page.helpDiv.firstElementChild).innerHTML = task.help;
                page.solvDiv.innerHTML = task.solv;

                page.helpDiv.style.display = 'none';
                page.solvDiv.style.display = 'none';

                this.stopTimer();
                this.view.draw();

                // Математичні формули у динамічному контенті
                (new Function("","MathJax.typeset()"))();            
            })

            page.menuDiv.appendChild(menuButton); 

        }
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
        if (glo.stepsCount % View.DISPLAY_INTERVAL == 0) {
            this.view.displayInfo();
            this.view.displaySelectedPlanet();
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



