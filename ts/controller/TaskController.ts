import { doc, glo } from '../globals/globals.js';
import { Problem } from '../model/Problem.js';
import { deserialization} from '../serialize/serialize.js';
import Controller from './Controller.js';

type TaskData = {
    imurl: string;
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


        doc.loadSceneButton.addEventListener('click', () => {            
            this.taskButtonsMaker();
            this.loadScene(doc.savedSceneArea.value);
        });

        doc.dataArea.addEventListener('dblclick', () => {
            if (doc.dataArea.style.height != '600px')
                doc.dataArea.style.height = '600px';
            else
            doc.dataArea.style.height = '60px';
        });
        
        this.loadProblems();
    }

    problems: Problem[] = [];

    async loadProblems() {
        try {
            const response = await fetch('opened_probs');
            if (!response.ok) {
                throw new Error(`Помилка завантаження файлу: ${response.statusText}`);
            }
            const text = await response.text();
            const regex = /TITLE:((.|\r|\n)*?)COND:((.|\r|\n)*?)INIT:((.|\r|\n)*?)ANSWER:((.|\r|\n)*?)---/gm
            const matches = [...text.matchAll(regex)];
            this.problems = matches.map(m => new Problem(m));

            // UI
            const options: HTMLOptionElement[] = this.problems.map((p, i) => new Option(p.title, i.toString()));
            doc.sceneSelect.innerHTML = '';
            doc.sceneSelect.append(...options); 
            doc.sceneSelect.selectedIndex = 0; 
            doc.sceneSelect.dispatchEvent(new Event('change'));
        } 
        catch (error: any) {
            console.error('Помилка:', error.message);
        }
    }



    // to grag task panels 
    //
    private bindTaskDivMouseEvents() {

        let cursor: {x: number, y: number} | null = null;
   
        doc.taskDiv.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = {x: e.screenX, y: e.screenY};
        });

        doc.taskDiv.addEventListener('mousemove', (e: MouseEvent) => { 
            if (cursor) {                              
                let dx = e.screenX - cursor.x;
                let dy = e.screenY - cursor.y;
                let style = window.getComputedStyle(doc.taskDiv);

                let left = parseFloat(style.left) + dx;
                doc.taskDiv.style.left = left + 'px';

                let top = parseFloat(style.top) + dy;
                doc.taskDiv.style.top = top + 'px';

                cursor = {x: e.screenX, y: e.screenY};
            }    
        });

        doc.taskDiv.addEventListener('mouseup', (e: MouseEvent) => {
            cursor = null;
        });

    }

    private bindTaskEvents()  
    {
        doc.openHelpButton.addEventListener('click', () => {
            doc.helpDiv.style.display='block'; 
            doc.openHelpButton.style.display='none';
        });

        doc.openSolvButton.addEventListener('click', () => {
            doc.solvDiv.style.display='block'; 
            doc.openSolvButton.style.display='none';
            this.loadScene(this.selectedTask!.final);          
        });

        doc.closeTaskButton.addEventListener('click', () => {
            doc.taskDiv.style.display = 'none';
        });

    }

    // Створює кнопки завдання і саджає не кожну свій обробник.
    //
    taskButtonsMaker() {
        const value = doc.dataArea.value;
        const loaderFunction = new Function("", `return [${value}];`);
        const data: TaskData[] = loaderFunction();
        
        doc.menuSpan.innerHTML = '';
        for (let task of data) {
            let taskButton = document.createElement('Button');
            taskButton.style.backgroundImage = `url('${task.imurl}')`;
            // taskButton.style.backgroundImage = `url('./assets/${task.id}.png')`;
            taskButton.title = task.title;
            
            // Обробник натискання на кнопку завдання
            taskButton.addEventListener('click', () => {
                this.selectedTask = task;
                this.loadScene(task.init);

                doc.openHelpButton.style.display = doc.openSolvButton.style.display = 'block';
                doc.taskDiv.style.display = 'block';
                doc.helpDiv.style.display = 'none';
                doc.solvDiv.style.display = 'none';

                (<HTMLDivElement>doc.condDiv.firstElementChild).innerHTML = task.cond;
                (<HTMLDivElement>doc.helpDiv.firstElementChild).innerHTML = task.help;
                (<HTMLDivElement>doc.solvDiv.firstElementChild).innerHTML = task.solv;

                // Математичні формули у динамічному контенті
                (new Function("","MathJax.typeset()"))();            
            })
            doc.menuSpan.append(taskButton); 

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
