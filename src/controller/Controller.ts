import Space from '../model/Space.js';
import View from '../view/View.js';

export default class Controller 
{
    state = 0;

    substate = 0;

    timer: number = 0;
    
    constructor(public space: Space, public view: View) 
    {
        this.bindHandlers();
    }

    private bindHandlers() 
    {
        // runButton click
        const runButton = document.getElementById('runButton')!;
        runButton.addEventListener('click', () => {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = 0;
                runButton.innerHTML = '>>'
            } else {
                this.timer = setInterval(() => {
                    this.space.step();
                    this.view.draw(); 
                }, 20);
                runButton.innerHTML = '||'  
            }  
        });
        
        // trackButton click
        const trackButton = document.getElementById('trackButton')!;
        trackButton.addEventListener('click', () => {
            this.view.trackMode = !this.view.trackMode;
            trackButton.innerHTML = this.view.trackMode ? '&nbsp;' : '~';      
        });

        // canvas mousedown - select planet
        const canvas = this.view.canvasElement
        canvas.addEventListener('mousedown', (e: MouseEvent) => {
            let w = canvas.width / 2, h = canvas.height / 2;
            let x = e.offsetX - w, y = - e.offsetY + h;
            this.space.trySelectPlanet(x, y);
            this.view.draw();
        });
        
    } 
    

   
}
