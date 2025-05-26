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

        doc.loadSceneButton.addEventListener('click', () => {            
            this.loadScene(doc.savedSceneArea.value);
        });

        doc.dataArea.addEventListener('dblclick', () => {
            if (doc.dataArea.style.height != '600px')
                doc.dataArea.style.height = '600px';
            else
            doc.dataArea.style.height = '60px';
        });
        
        // завантажує сцену і умову обраної задачі
        const loadProblemInitScene = () => {
            // 
            let idx = +doc.sceneSelect.value;
            if (idx == 0) {
                this.controller.clearScene();
                return;
            }    
            let problem = this.problems[idx];
            this.loadScene(problem.init);

            // UI & view 
            
            doc.condDiv.innerHTML = problem.cond;
            doc.problemBoard.style.display = 'block'; 
            doc.problemBoard.style.backgroundColor = 'rgba(241, 241, 10, 0.1)';
            doc.answerText.style.display = problem.isAnswerNumber ? 'inline' : 'none';

        }

        doc.sceneSelect.addEventListener("change", loadProblemInitScene);

        doc.sceneSelect.addEventListener("click", loadProblemInitScene);

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
