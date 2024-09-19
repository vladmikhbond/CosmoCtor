import { page, glo } from '../globals/globals.js';
import { deserialization} from '../serialize/serialize.js';
import Controller from './Controller.js';

type TaskData = {
    id: string;
    title: string;
    init: string;
    cond: string;
    help: string;
    solv: string;
    final: string;
}

export default class TaskController 
{

    selectedTask: TaskData | null = null; 

    constructor(public controller: Controller) {
        this.bindTaskDivMouseEvents();
        this.bindTaskEvents();


        page.loadSceneButton.addEventListener('click', () => {            
            this.taskButtonsMaker();
            this.loadScene(page.sceneArea.value);
        });

        page.dataArea.addEventListener('dblclick', () => {
            if (page.dataArea.style.height != '600px')
                page.dataArea.style.height = '600px';
            else
            page.dataArea.style.height = '60px';
        });
        
    }

    // to grag task panels 
    //
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

    private bindTaskEvents()  
    {
        page.openHelpButton.addEventListener('click', () => {
            page.helpDiv.style.display='block'; 
            page.openHelpButton.style.display='none';
        });

        page.openSolvButton.addEventListener('click', () => {
            page.solvDiv.style.display='block'; 
            page.openSolvButton.style.display='none';
            this.loadScene(this.selectedTask!.final);          
        });

        page.closeTaskButton.addEventListener('click', () => {
            page.taskDiv.style.display = 'none';
        });

    }

    // Створює кнопки завдання і саджає не кожну свій обробник.
    //
    taskButtonsMaker() {
        const value = page.dataArea.value;
        const loaderFunction = new Function("", `return [${value}];`);
        const data: TaskData[] = loaderFunction();
        
        page.menuSpan.innerHTML = '';
        for (let task of data) {
            let taskButton = document.createElement('Button');
            taskButton.style.backgroundImage = `url('/assets/${task.id}.png')`;
            taskButton.title = task.title;
            
            // Обробник натискання на кнопку завдання
            taskButton.addEventListener('click', () => {
                this.selectedTask = task;
                this.loadScene(task.init);

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
            page.menuSpan.append(taskButton); 

        }

    }


    loadScene(data: string) {
        const space = this.controller.space;
        const view = this.controller.view;


        
        space.planets = [];
        space.starters = [];
        if (data) {
            let o = deserialization(data);
            space.planets = o.planets;
            space.starters = o.starters;
        }
        this.controller.stopTimer();
        glo.stepsCount = 0;
        view.draw();
        view.displayInfo();
    }
 
}
