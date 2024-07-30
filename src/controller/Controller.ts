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
        document.getElementById('runButton')?.addEventListener('click', () => {
            if (this.timer) 
                return;
            this.timer = setInterval(() => {
                this.space.step();
                this.view.draw(); 
            }, 20);            
        });
        
        document.getElementById('stopButton')?.addEventListener('click', () => {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = 0;
            }           
        });

        document.getElementById('canvas')?.addEventListener('mousedown', (e: MouseEvent) => {
            let w = this.view.canvasElement.width / 2, h = this.view.canvasElement.height / 2;
            let x = e.offsetX - w, y = - e.offsetY + h;
            alert(`${x}, ${y}`);
        });
        
    } 
    

   
}
