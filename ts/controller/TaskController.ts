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
        this.addProblemBoardMouseEvents();
        this.addPlanetBoardMouseEvents();
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
        this.controller.clearSpace();
        if (idx == 0) {
            doc.problemBoard.style.display = 'none';
            doc.planetBoard.style.display = 'none';
            return;
        }    
        let problem = this.problems[idx];
        this.restoreSceneFromJson(problem.init);
        
        // UI & view 
        doc.condDiv.innerHTML = problem.cond;
        (window as any).MathJax.typesetPromise([doc.condDiv]);  // мат.формули
        doc.problemBoard.style.display = 'block';         
        doc.checkmarkImg.style.display = 'none';
        doc.crossmarkImg.style.display = 'none';
    }


    restoreSceneFromJson(json: string) {
        const space = this.controller.space;
        const view = this.controller.view;

        this.controller.clearSpace();
        if (json) {
            let o = deserialization(json);
            space.planets = o.planets;
            space.starters = o.starters;
        }
        this.controller.stopTimer();
        glo.chronos = 0;
        view.draw();
        view.displayTime_n_Number();
    }
 

    checkAnswer() {
        const id = +doc.sceneSelect.value;
        const problem = this.problems[id]; 
        let testOk = false;
        // 

        let answer = problem.answer;            
        let ALL = false; 
        let T = 1000;

        let match = answer.match(/([AE]):(\d+)/);
        if (match) {
            if (match[1] == 'A') ALL = true;
            if (match[1] == 'E') ALL = false;
            T = +match[2];
            answer = problem.answer.slice(match[0].length).trim();
        }
                    
        let savedScene = serialization(this.controller.space);  

        const FUN = new Function('t, p', `
            const $ = (a, b, c=0.01) => Math.abs(a - b) < c;
            return ${answer};
        `);
                
        if (ALL) 
        {
            testOk = true;
            for (let t = 0; t <= T; t++) {
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
            for (let t = 0; t <= T; t++) {
                if (FUN(t, this.controller.space.planets)) {
                    testOk = true;
                    break;
                }
                this.controller.space.step();
            }
        }
        this.restoreSceneFromJson(savedScene) 
        this.controller.view.draw();
    
        // show success  
        doc.checkmarkImg.style.display = testOk ? 'inline' : 'none';
        doc.crossmarkImg.style.display = testOk ? 'none' : 'inline';
    }


    private addProblemBoardMouseEvents() {

        let cursorPos: {x: number, y: number} | null = null;
   
        doc.problemBoard.addEventListener('mousedown', (e: MouseEvent) => {
            cursorPos = {x: e.clientX, y: e.clientY}; 
        });

        doc.problemBoard.addEventListener('mousemove', (e: MouseEvent) => { 
            if (cursorPos) {                              
                let dx = e.clientX - cursorPos.x;
                let dy = e.clientY - cursorPos.y;
                let style = window.getComputedStyle(doc.problemBoard);

                let left = parseFloat(style.left) + dx;
                doc.problemBoard.style.left = left + 'px';

                let top = parseFloat(style.top) + dy;
                doc.problemBoard.style.top = top + 'px';

                cursorPos = {x: e.clientX, y: e.clientY};
            }    
        });

        doc.problemBoard.addEventListener('mouseup', (e: MouseEvent) => {
            cursorPos = null;
        });

    }

    private addPlanetBoardMouseEvents() {

        let cursorPos: {x: number, y: number} | null = null;
   
        doc.planetBoard.addEventListener('mousedown', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT') {
                return;
            }
            cursorPos = {x: e.clientX, y: e.clientY}; 
        });

        doc.planetBoard.addEventListener('mousemove', (e: MouseEvent) => { 
            if (cursorPos) {                              
                let dx = e.clientX - cursorPos.x;
                let dy = e.clientY - cursorPos.y;
                let style = window.getComputedStyle(doc.planetBoard);

                let right = parseFloat(style.right) - dx;
                doc.planetBoard.style.right = right + 'px';

                let top = parseFloat(style.top) + dy;
                doc.planetBoard.style.top = top + 'px';

                cursorPos = {x: e.clientX, y: e.clientY};
            }    
        });

        doc.planetBoard.addEventListener('mouseup', (e: MouseEvent) => {
            cursorPos = null;
        });
        
    }


}
