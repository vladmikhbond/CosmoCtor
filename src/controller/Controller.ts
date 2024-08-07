import { page, glo } from '../globals/globals.js';
import Planet from '../model/Planet.js';
import Rocket from '../model/Rocket.js';
import Space from '../model/Space.js';
import View from '../view/View.js';

export default class Controller {
    static DISPLAY_PER_STEPS = 500 / glo.STEP_PERIOD | 0; // to display 2 times per second

    stepTimer = 0;

    timeStamp = Date.now();

    constructor(public space: Space, public view: View) {
        this.bindHandlers();
        this.bindDashboardHandlers();
        this.bindPlanetBoardHandlers();
    }

    private bindHandlers() {
        // hideButton_click
        page.hideButton.addEventListener('click', () => {
            if (page.dashboard.style.display == 'none')
                page.dashboard.style.display = 'block';
            else
                page.dashboard.style.display = 'none';

        });

        // #region planet selection and dragging

        let dragged = false;

        // canvas_mousedown: select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            let x = (e.offsetX - page.canvas.width / 2) / glo.SCOPE;
            let y = -(e.offsetY - page.canvas.height / 2) / glo.SCOPE;

            dragged = this.space.trySelectPlanet(x, y);
            page.planetBoard.style.display = dragged ? 'block' : 'none';
            page.actionDiv.style.display = 'none';
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
                return { name: p.name, m: p.m, r: p.r, x: p.x, y: p.y, vx: p.vx, vy: p.vy, color: p.color };
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
                return p;
            })
            this.view.draw();
        });

    }

    private bindDashboardHandlers() {
        // runButton_click
        page.runButton.addEventListener('click', () => {
            if (!this.stepTimer) {
                this.stepTimer = setInterval(() => {
                    this.space.step();
                    this.view.draw();

                    if (glo.stepsCount % Controller.DISPLAY_PER_STEPS == 0) {
                        // speedometer
                        let ms = Date.now() - this.timeStamp;
                        this.timeStamp = Date.now();
                        let stepsPerSec = Controller.DISPLAY_PER_STEPS * 1000 / ms;
                        // footer 
                        this.view.displayFooter(stepsPerSec);
                    }
                }, glo.STEP_PERIOD);
            }
        });

        // stepButton_click
        page.stepButton.addEventListener('click', () => {
            if (this.stepTimer) {
                clearInterval(this.stepTimer);
                this.stepTimer = 0;
            }
            this.space.step();
            this.view.draw();
        });


        // trackButton_click  
        page.trackButton.addEventListener('click', () => {
            this.view.trackMode = !this.view.trackMode;
            page.trackButton.innerHTML = this.view.trackMode ? '●' : 'T';
            this.view.draw();
        });


        // telescope
        page.scopeRange.addEventListener('change', () => {
            glo.SCOPE = 1.2 ** page.scopeRange.valueAsNumber;
            this.view.draw();
        });
    }

    private bindPlanetBoardHandlers() {
        // plusButton_click: create new planet 
        page.plusButton.addEventListener('click', () => {
            // get standard or copy selected planet
            let planet = this.space.selectedPlanet ?
                <Planet>{ ...this.space.selectedPlanet } :
                new Planet();
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

//#region Action

        page.actionSelect.addEventListener('change', () => {
            switch (page.actionSelect.value) {
                case 'nothingOption':
                    page.actionDiv.style.display='none';
                    break;
                case 'rocketOption':
                    page.span1.innerHTML = 'Velo ';
                    page.span2.innerHTML = 'Time ';                    
                    page.actionDiv.style.display='block';
                    break;
                case 'nebulaOption':
                    page.actionDiv.style.display='block';
                    break;
                }
        });

        // okButton_click  
        page.okButton.addEventListener('click', () => {

            switch (page.actionSelect.value) {
                case 'rocketOption':
                    let velo = +page.field1.value / 100;
                    let time = +page.field2.value * 1000;
                    let rocket = new Rocket(velo, this.space.selectedPlanet!);
                    setTimeout(() => {
                        this.space.planets.push(rocket);
                    }, time);
                    break;
                    
                case 'nebulaOption':
                    break;
            }
        });

//#endregion

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
