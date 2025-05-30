import { doc, glo } from '../globals/globals.js';
import { Problem } from '../model/Problem.js';
import { serialization, deserialization} from '../serialize/serialize.js';
import Controller from './Controller.js';


export default class TaskController 
{
    problems: Problem[] = [];
    controller: Controller;

    constructor(controller: Controller) 
    {
        this.controller = controller;
        this.addEventListeners();
        this.addProblemBoardMouseEvents()
        this.loadAllProblems();
    }


    addEventListeners() 
    {
        doc.saveSceneButton.addEventListener('click', () => {
            let json = serialization(this.controller.space);
            doc.savedSceneArea.innerHTML = json;
        });

        doc.restoreSceneButton.addEventListener('click', () => {            
            this.restoreSceneFromJson(doc.savedSceneArea.value);
        });
        
        doc.sceneSelect.addEventListener("change", () => { 
            this.loadSelectedProblem(); 
        });

        doc.sceneSelect.addEventListener("click", () => { 
            this.loadSelectedProblem(); 
        });

        doc.answerButton.addEventListener('click', () => {
            this.checkAnswer();   
        });
    }


    // Завантажує усі відкриті задачі
    //
    async loadAllProblems() {
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

    // завантажує сцену і умову обраної задачі
    //
    loadSelectedProblem() {
        let idx = +doc.sceneSelect.value;
        this.controller.clearScene();
        if (idx == 0) {
            return;
        }    
        let problem = this.problems[idx];
        this.restoreSceneFromJson(problem.init);
        
        // UI & view 
        doc.condDiv.innerHTML = problem.cond;
        (window as any).MathJax.typesetPromise([doc.condDiv]);  // мат.формули
        doc.problemBoard.style.display = 'block';         
        doc.answerText.style.display = problem.isAnswerNumber ? 'inline' : 'none';
        doc.checkmarkImg.style.display = 'none';
        doc.crossmarkImg.style.display = 'none';
    }


    restoreSceneFromJson(json: string) {
        const space = this.controller.space;
        const view = this.controller.view;

        this.controller.clearScene();
        if (json) {
            let o = deserialization(json);
            space.planets = o.planets;
            space.starters = o.starters;
        }
        this.controller.stopTimer();
        glo.stepsCount = 0;
        view.draw();
        view.displayInfo();
    }
 

    checkAnswer() {
        const id = +doc.sceneSelect.value;
        const problem = this.problems[id]; 
        let testOk = false;
        // 
        if (problem.isAnswerNumber) 
        {
            const MAX_ERROR = 0.03;  // 3%               
            let epsilon = Math.abs((+doc.answerText.value - +problem.answer) / +problem.answer);
            testOk = doc.answerText.value == problem.answer || epsilon < MAX_ERROR
        } 
        else 
        {
            let STEP_COUNT = 1000;
            let answer = problem.answer;
            let forAll = false;            
            if (problem.answer.startsWith('ALL')) {
                answer = problem.answer.slice(3).trim();
                forAll = true;
            }
            let savedScene = serialization(this.controller.space);  

            const FUN = new Function('t, p', `
                const E = (a, b, c=0.01) => Math.abs(a - b) < c;
                return ${answer};
            `);
                    
            if (forAll) 
            {
                testOk = true;
                for (let t = 0; t <= STEP_COUNT; t++) {
                    if (!FUN(t, this.controller.space.planets)) {
                        testOk = false;
                        break;
                    }
                    this.controller.space.step();
                }
            } 
            else 
            {
                testOk = false;
                for (let t = 0; t <= STEP_COUNT; t++) {
                    if (FUN(t, this.controller.space.planets)) {
                        testOk = true;
                        break;
                    }
                    this.controller.space.step();
                }
            }



            this.restoreSceneFromJson(savedScene) 
            this.controller.view.draw();
        }
        // show success  
        doc.checkmarkImg.style.display = testOk ? 'inline' : 'none';
        doc.crossmarkImg.style.display = testOk ? 'none' : 'inline';
    }



    private addProblemBoardMouseEvents() {

        let cursor: {x: number, y: number} | null = null;
   
        doc.problemBoard.addEventListener('mousedown', (e: MouseEvent) => {
            cursor = {x: e.clientX, y: e.clientY}; 
        });

        doc.problemBoard.addEventListener('mousemove', (e: MouseEvent) => { 
            if (cursor) {                              
                let dx = e.clientX - cursor.x;
                let dy = e.clientY - cursor.y;
                let style = window.getComputedStyle(doc.problemBoard);

                let left = parseFloat(style.left) + dx;
                doc.problemBoard.style.left = left + 'px';

                let top = parseFloat(style.top) + dy;
                doc.problemBoard.style.top = top + 'px';

                cursor = {x: e.clientX, y: e.clientY};
            }    
        });

        doc.problemBoard.addEventListener('mouseup', (e: MouseEvent) => {
            cursor = null;
        });

    }
}
