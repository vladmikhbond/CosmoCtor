import {doc} from './globals/globals.js';
import Space from './model/Space.js';
import View from './view/View.js';
import Controller from './controller/Controller.js';
import TaskController from './controller/TaskController.js';

const space = new Space();
const view = new View(space);
const cont = new Controller(space, view);
new TaskController(cont);
view.draw();

// load a scene from sceneArea and tasks from dataArea
doc.loadSceneButton.dispatchEvent(new MouseEvent('click'));
