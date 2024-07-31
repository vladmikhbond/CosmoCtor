import {page} from '../globals/globals.js';
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
        // hideButton_click
        page.hideButton.addEventListener('click', () => {
            if (page.dashboard.style.display == 'none')
                page.dashboard.style.display = 'block';
            else
            page.dashboard.style.display = 'none';

        });

        // runButton_click
        page.runButton.addEventListener('click', () => {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = 0;
                page.runButton.innerHTML = '►'
            } else {
                this.timer = setInterval(() => {
                    this.space.step();
                    this.view.draw(); 
                }, 20);
                page.runButton.innerHTML = '■'  
            }  
        });
        
        // trackButton_click  
        page.trackButton.addEventListener('click', () => {
            this.view.trackMode = !this.view.trackMode;
            page.trackButton.innerHTML = this.view.trackMode ? '·' : 'Ꜿ';     
        });

        // canvas_mousedown - select planet
        page.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            let w = page.canvas.width / 2, h = page.canvas.height / 2;
            let x = e.offsetX - w, y = - e.offsetY + h;
            this.space.trySelectPlanet(x, y);
            this.view.draw();
        });
        
        
    } 
    

   
}
