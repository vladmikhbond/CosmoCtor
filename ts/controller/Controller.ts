import { doc, glo } from '../globals/globals.js';
import { serialization, deserialization} from '../serialize/serialize.js';
import Planet from '../model/Planet.js';
import Space from '../model/Space.js';
import View from '../view/View.js';
import { StarterKind } from '../model/Starter.js';

export default class Controller 
{
    stepTimer = 0;
    savedSceneJson = '';

    constructor(public space: Space, public view: View) {
        this.bindButtonClickEvents();
        this.bindCanvasMouseEvents();
        this.bindChangeEvents();
        this.bindStarterEvents()
        this.bindCustomEvents();
    }

    private bindCustomEvents() 
    {
        this.space.addEventListener('selectPlanetEvent', e => {
            let planet = <Planet|null>(<CustomEvent>e).detail;
            if (planet) {
                this.view.displaySelectedPlanetParams(); 
                doc.planetBoard.style.display = 'block';
            } else {
                doc.planetBoard.style.display = 'none';
                doc.nebulaBoard.style.display = 'none';
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
        // runButton
        doc.runButton.addEventListener('click', () => {
            if (!this.stepTimer) {
                // doc.saveSceneButton.dispatchEvent(new Event("click"));
                this.savedSceneJson = serialization(this.space);
                this.startTimer();
            } else {
                this.stopTimer();    
            }
        });

        // restartButton
        doc.restartButton.addEventListener('click', () => {
            if (this.savedSceneJson) {
                let d = deserialization(this.savedSceneJson);
                this.space.planets = d.planets;
                this.space.starters = d.starters;
                   
            }
            this.stopTimer(); 
            this.view.draw()
        });

        // stepButton
        doc.stepButton.addEventListener('click', () => {
            this.stopTimer(); 
            this.step();
            this.view.displayInfo();
        });
            
        // trackButton
        doc.trackButton.addEventListener('click', () => {
            this.view.trackMode = !this.view.trackMode;
            if (!this.view.trackMode) {
                this.space.clearAllTracks();
            }
            doc.trackButton.innerHTML = this.view.trackMode ? 'N' : 'T';
            this.view.draw();
        });


        // Get standard or copy selected planet
        //
        doc.planetButton.addEventListener('click', () => {
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


        // 
        doc.applyButton.addEventListener('click', () => {
            this.applyParams()
            this.view.draw();
        });

    }
    
    private bindStarterEvents() {       

        doc.rocketButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) { 
                doc.rocketBoard.style.display='block'; 
                doc.nebulaBoard.style.display='none';                   
                this.view.draw();
            }
        
        });

        doc.nebulaButton.addEventListener('click', () => {
            if (this.space.selectedPlanet) {  
                doc.nebulaBoard.style.display='block';
                doc.rocketBoard.style.display='none'; 
                this.view.draw();
            } 
        });
        

        doc.okButton1.addEventListener('click', () => {

            this.space.starters.unshift({
                kind:  StarterKind.Rocket, 
                velo: +doc.velo.value, 
                count: 0, 
                size:0,
                startStep: +doc.interval1.value + glo.stepsCount, 
                planetName: this.space.selectedPlanet!.name,
                distr: "",
            });
            doc.rocketBoard.style.display = 'none';
        });

        doc.okButton2.addEventListener('click', () => {
            
            this.space.starters.unshift({
                kind: StarterKind.Nebula,
                velo: +doc.moment.value,
                count: +doc.count.value, 
                size: +doc.size.value, 
                startStep: +doc.interval2.value + glo.stepsCount, 
                planetName: this.space.selectedPlanet!.name,
                distr: doc.distr.value,
            });
            doc.nebulaBoard.style.display = 'none';
        });


        doc.cancelButton1.addEventListener('click', () => {
            doc.rocketBoard.style.display = 'none';
        });

        doc.cancelButton2.addEventListener('click', () => {
            doc.nebulaBoard.style.display = 'none';
        });

    }

    private bindCanvasMouseEvents() {

        let isPlanetDragging = false;
        let cursor: {x: number, y: number} | null = null;
        
        // canvas_mousedown: select planet
        doc.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            // save params for selected planet
            this.applyParams();
            // select a planet
            cursor = glo.retransformXY(e.offsetX, e.offsetY);
            isPlanetDragging = this.space.trySelectPlanet(cursor.x, cursor.y);
            // show
            this.view.draw();
            this.view.displaySelectedPlanetParams();
        });

        doc.canvas.addEventListener('mousemove', (e: MouseEvent) => {
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
                this.view.draw();
                this.view.drawCursorCoords(point, gx, gy);
                //this.view.drawGraviTension(point, gx, gy);
                

            }
        });

        doc.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            isPlanetDragging = false;
            cursor = null;
        });
   
    }

    private bindChangeEvents() {
        // telescope
        doc.scopeRange.addEventListener('change', () => {
            glo.scale = 2**(doc.scopeRange.valueAsNumber/2);
            this.view.draw();
        });


        // textfields_changed
        const handler = () => { this.applyParams(); };

        doc.xText.addEventListener('change', handler);
        doc.yText.addEventListener('change', handler);
        doc.vxText.addEventListener('change', handler);
        doc.vyText.addEventListener('change', handler);
        doc.nameText.addEventListener('change', handler);
        doc.colorText.addEventListener('change', handler);
        doc.massaText.addEventListener('change', handler);
        doc.radiusText.addEventListener('change', handler);

        // canvas_keydown
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Delete':
                    this.space.removeSelectedPlanet()
                    this.view.draw();               
                    break;
                // step execution
                case 's': case 'S': case 'і': case 'І':
                    doc.stepButton.dispatchEvent(new Event("click"));
                    break;
                // step execution
                case 't': case 'T': case 'е': case 'Е':
                    doc.trackButton.dispatchEvent(new Event("click"));
                    break;
            };
        });
    }

    applyParams() {
        let planet = this.space.selectedPlanet;
        if (planet) {
            planet.x = +doc.xText.value;
            planet.y = +doc.yText.value;
            planet.vx = +doc.vxText.value;
            planet.vy = +doc.vyText.value;

            planet.m = +doc.massaText.value;
            planet.r = +doc.radiusText.value;
            planet.name = doc.nameText.value;
            planet.color = doc.colorText.value;
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
        // '■'
        (doc.runButton.children[0] as HTMLImageElement).src = "static/assets/icons/stop-fill.svg";
    }

    public stopTimer() {
        clearInterval(this.stepTimer);
        this.stepTimer = 0;
        // '►'
        (doc.runButton.children[0] as HTMLImageElement).src = "static/assets/icons/play-fill.svg";
        this.view.displayInfo();
    }

    public clearScene() {
        this.space.planets = [];
        this.space.starters = [];
        this.stopTimer();
        glo.stepsCount = 0;
        doc.canvas.style.backgroundColor = 'darkblue';
        this.view.draw();
    }

}
