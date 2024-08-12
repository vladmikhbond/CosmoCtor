import { page, glo } from '../globals/globals.js';
import Nebula from '../model/Nebula.js';
import Planet from '../model/Planet.js';
import Rocket from '../model/Rocket.js';
import Space from '../model/Space.js';
import View from '../view/View.js';

export default class Controller {
    static DISPLAY_INTERVAL = 500 / glo.STEP_PERIOD | 0; // to display 2 times per second

    stepTimer = 0;

    timeStamp = Date.now();

    constructor(public space: Space, public view: View) {
        this.bindClickEvents();
        this.bindMouseEvents();
        this.bindChangeEvents();
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
            this.view.draw();
        });

        // runButton_click
        page.runButton.addEventListener('click', () => {
            if (!this.stepTimer) {
                this.stepTimer = setInterval(() => {
                    this.space.step();
                    this.view.draw();

                    if (glo.stepsCount % Controller.DISPLAY_INTERVAL == 0) {
                        // speedometer
                        let milliseconds = Date.now() - this.timeStamp;
                        this.timeStamp = Date.now();
                        let stepsPerSec = Controller.DISPLAY_INTERVAL * 1000 / milliseconds;
                        // footer 
                        this.view.displayFooter(stepsPerSec, this.space.planets.length);
                    }
                }, glo.STEP_PERIOD);
                page.runButton.innerHTML = '■';
                page.runButton.style.backgroundColor = 'coral';
            } else {
                clearInterval(this.stepTimer);
                this.stepTimer = 0;
                page.runButton.innerHTML = '►';
                page.runButton.style.backgroundColor = 'aquamarine';
            }
        });

        // stepButton_click
        page.stepButton.addEventListener('click', () => {
            // if (this.stepTimer) {
            //     clearInterval(this.stepTimer);
            //     this.stepTimer = 0;
            // }
            this.space.step();
            this.view.draw();
        });


        // trackButton_click  
        page.trackButton.addEventListener('click', () => {
            this.view.trackMode = !this.view.trackMode;
            page.trackButton.innerHTML = this.view.trackMode ? '●' : 'T';
            this.view.draw();
        });

        // plusButton_click: create new planet 
        page.plusButton.addEventListener('click', () => {
            if (page.actionSelect.value == 'planetOption') 
            {
                // get standard or copy selected planet
                let planet = new Planet();

                if (this.space.selectedPlanet) {
                    planet = <Planet>{ ...this.space.selectedPlanet };
                    planet.y += page.canvas.height / 4 * glo.scale;
                }
                this.space.planets.push(planet);
                this.space.selectedPlanet = planet;
     
            }
            else if (page.actionSelect.value == 'rocketOption') 
            {
                if (this.space.selectedPlanet && this.space.selectedPlanet.v > 0.01) {
                    page.span1.innerHTML = 'Velo ';
                    page.span2.innerHTML = 'Time '; 
                    page.field1.value = '1';
                    page.field2.value = '0';  
                    page.actionBoard.style.display='block';                    
                } else {
                    alert('Select a moving planet before.');
                }
            }
            else if (page.actionSelect.value == 'nebulaOption') 
            {
                if (this.space.selectedPlanet) {
                    page.actionBoard.style.display='block';
                    page.span1.innerHTML = 'Number ';
                    page.span2.innerHTML = 'Radius '; 
                    page.field1.value = '1000';
                    page.field2.value = '400';  
                    page.actionBoard.style.display='block';
                } else {
                    alert('Select a planet before.');
                }
            }
            this.view.draw();                
        });

        // actionButton_click  
        page.actionButton.addEventListener('click', () => {
            let timeout = +page.field2.value * 1000;
            let planet = this.space.selectedPlanet!;

            if (page.actionSelect.value === 'rocketOption') 
            {
                let velo = +page.field1.value;
                setTimeout(() => {
                    let rocket = new Rocket(velo, planet);
                    this.space.planets.push(rocket);
                    this.view.draw(); 
                }, timeout);
                page.actionBoard.style.display = 'none';
            } 
            else if (page.actionSelect.value === 'nebulaOption') 
            {
                let n = +page.field1.value;
                let R = +page.field2.value;
                new Nebula(n, R, this.space);                       
                this.view.draw();                        
            }
            page.actionBoard.style.display = 'none';
        });


        // minusButton_click: remove selected planet
        page.minusButton.addEventListener('click', () => {
            this.space.tryRemoveSelectedPlanet();
            this.view.draw();
        });


    }

    private bindMouseEvents() {

        let planetDragged = false;
        let cursor: {x: number, y: number} | null = null;
        
        // canvas_mousedown: select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = glo.retransform(e.offsetX, e.offsetY);
            planetDragged = this.space.trySelectPlanet(cursor.x, cursor.y);
            if (planetDragged) {
                page.planetBoard.style.display = 'block';
            } else {
                page.planetBoard.style.display = 'none';
                // page.actionDiv.style.display = 'none';
            }
            this.view.draw();
        });

        page.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            let point = glo.retransform(e.offsetX, e.offsetY); 
            if (planetDragged) {                              
                this.space.selectedPlanet!.x = point.x;
                this.space.selectedPlanet!.y = point.y;
                this.view.draw();
            } else if (cursor != null) {
                glo.shiftX += (point.x - cursor.x) * glo.scale; 
                glo.shiftY -= (point.y - cursor.y) * glo.scale;
                cursor = point;
                this.view.draw();
            }
        });

        page.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            planetDragged = false;
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

}



