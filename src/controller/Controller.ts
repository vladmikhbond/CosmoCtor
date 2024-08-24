import { page, glo } from '../globals/globals.js';
import { data } from './data.js';

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
        this.helpDivMouseEvents();
        this.bindChangeEvents();
        this.bindMenuEvents();
        
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
            let objects = this.space.planets.map(p => {
                return { name: p.name, m: p.m, r: p.r, x: p.x, y: p.y, vx: p.vx, vy: p.vy, color: p.color };
            });
            let json = JSON.stringify(objects);
            page.sceneArea.innerHTML = json;
        });

        // loadSceneButton: load space.planets
        page.loadSceneButton.addEventListener('click', () => {
            let json = page.sceneArea.value;
            let objects: [] = JSON.parse(json);

            this.space.planets = objects.map(o => {
                let p = new Planet();
                Object.assign(p, o);
                return p;
            })
            this.stopTimer();
            this.view.draw();
        });

        // runButton_click
        page.runButton.addEventListener('click', () => {
            if (!this.stepTimer) {
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
            page.trackButton.innerHTML = this.view.trackMode ? '●' : 'T';
            this.view.draw();
        });

        // get standard or copy selected planet
        //
        page.planetButton.addEventListener('click', () => {
            
            let planet = new Planet();
            if (this.space.selectedPlanet) {                
                Object.assign(planet, this.space.selectedPlanet);
            }
            this.space.planets.push(planet);
            this.space.selectedPlanet = planet;
            this.view.draw();          
        });

        enum CreateMode { Planet, Rocket, Nebula };

        let mode: CreateMode = CreateMode.Planet;
        

        page.rocketButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) {
                page.span1.innerHTML = 'Velo ';
                page.span2.innerHTML = 'Time '; 
                page.field1.value = '1';
                page.field2.value = '0';  
                page.actionBoard.style.display='block';                    
                this.view.draw();
                mode = CreateMode.Rocket;
            } else {
                alert('Select a moving planet before.');
            }
        
        });

        page.nebulaButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) {
                page.actionBoard.style.display='block';
                page.span1.innerHTML = 'Number ';
                page.span2.innerHTML = 'Radius '; 
                page.field1.value = '2000';
                page.field2.value = '400';  
                page.actionBoard.style.display='block';
                this.view.draw();
                mode = CreateMode.Nebula;
            } else {
                alert('Select a planet before.');
            }
        });
        
        // actionButton_click  
        page.okButton.addEventListener('click', () => {
            let timeout = +page.field2.value * 1000;
            let planet = this.space.selectedPlanet!;

            if (mode === CreateMode.Rocket) 
            {
                let velo = +page.field1.value;
                setTimeout(() => {
                    let rocket = new Rocket(velo, planet);
                    this.space.planets.push(rocket);
                    this.view.draw(); 
                }, timeout);
                page.actionBoard.style.display = 'none';
            } 
            else if (mode === CreateMode.Nebula) 
            {
                let n = +page.field1.value;
                let R = +page.field2.value;
                new Nebula(n, R, this.space);                       
                this.view.draw();                        
            }
            page.actionBoard.style.display = 'none';
        });

        page.cancelButton.addEventListener('click', () => {
            page.actionBoard.style.display = 'none';
        });

        // minusButton_click: remove selected planet
        page.delButton.addEventListener('click', () => {
            this.space.tryRemoveSelectedPlanet();
            this.view.draw();
        });

    }

    private canvasMouseEvents() {

        let planetDragged = false;
        let cursor: {x: number, y: number} | null = null;
        
        // canvas_mousedown: select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = glo.retransformXY(e.offsetX, e.offsetY);
            planetDragged = this.space.trySelectPlanet(cursor.x, cursor.y);
            if (planetDragged) {
                page.planetBoard.style.display = 'block';
            } else {
                page.planetBoard.style.display = 'none';
                // page.actionDiv.style.display = 'none';
            }
            this.view.draw();
            this.view.displaySelectedPlanet();
        });

        page.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            let point = glo.retransformXY(e.offsetX, e.offsetY); 
            if (planetDragged) {                              
                this.space.selectedPlanet!.x = point.x;
                this.space.selectedPlanet!.y = point.y;
                this.view.draw();
                this.view.displaySelectedPlanet();
            } else if (cursor != null) {
                glo.shiftX += (point.x - cursor.x) * glo.scale; 
                glo.shiftY -= (point.y - cursor.y) * glo.scale;
                cursor = point;
                this.view.drawXY(point);
            }
            // draw cursor coords
            if (!this.stepTimer) {
                this.view.drawXY(point);
            }
        });

        page.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            planetDragged = false;
            cursor = null;
        });
   
    }

    private helpDivMouseEvents() {

        let cursor: {x: number, y: number} | null = null;
        
        page.helpDiv.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = {x: e.screenX, y: e.screenY};
        });

        page.helpDiv.addEventListener('mousemove', (e: MouseEvent) => { 
            if (cursor) {                              
                let dx = e.screenX - cursor.x;
                let dy = e.screenY - cursor.y;
                let style = window.getComputedStyle(page.helpDiv);

                let left = parseFloat(style.left) + dx;
                page.helpDiv.style.left = left + 'px';

                let top = parseFloat(style.top) + dy;
                page.helpDiv.style.top = top + 'px';

                cursor = {x: e.screenX, y: e.screenY};
            }    
        });

        page.helpDiv.addEventListener('mouseup', (e: MouseEvent) => {
            cursor = null;
        });
   

        page.conditionDiv.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = {x: e.screenX, y: e.screenY};
        });

        page.conditionDiv.addEventListener('mousemove', (e: MouseEvent) => { 
            if (cursor) {                              
                let dx = e.screenX - cursor.x;
                let dy = e.screenY - cursor.y;
                let style = window.getComputedStyle(page.conditionDiv);

                let left = parseFloat(style.left) + dx;
                page.conditionDiv.style.left = left + 'px';

                let top = parseFloat(style.top) + dy;
                page.conditionDiv.style.top = top + 'px';

                cursor = {x: e.screenX, y: e.screenY};
            }    
        });

        page.conditionDiv.addEventListener('mouseup', (e: MouseEvent) => {
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
                    this.space.tryRemoveSelectedPlanet()
                    this.view.draw();               
                    break;
            };
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

    private step() {
        this.space.step();
        this.view.draw();
        if (glo.stepsCount % View.DISPLAY_INTERVAL == 0) {
            this.view.displayInfo();
            // виділену планету поглинули
            if (this.space.planets.filter(p => p == this.space.selectedPlanet).length == 0) {
                page.planetBoard.style.display = 'none';
            }
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


    private bindMenuEvents()  {

        for (let task of data) {
            let menuButton = document.createElement('Button');
            menuButton.style.backgroundImage = `url('/assets/${task.name}.png')`;
            menuButton.title = task.title;
            
            menuButton.addEventListener('click', () => {
                this.space.planets = task.planets.map(o => {
                    let p = new Planet();
                    Object.assign(p, o);
                    return p;
                });

                (<HTMLDivElement>page.conditionDiv.firstElementChild).innerHTML = task.cond;
                page.conditionDiv.style.display = 'block';

                (<HTMLDivElement>page.helpDiv.firstElementChild).innerHTML = task.help;
                page.helpDiv.style.top = page.conditionDiv.offsetTop + page.conditionDiv.clientHeight + 'px';
                page.helpDiv.style.display = 'none';

                this.stopTimer();
                this.view.draw();
                // Математичні формули у динамічному контенті
                (new Function("","MathJax.typeset()"))();            
            })

            page.menuDiv.appendChild(menuButton); 

        }
    }

}



