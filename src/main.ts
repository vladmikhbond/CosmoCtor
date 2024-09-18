import {page} from './globals/globals.js';
import Controller from './controller/Controller.js';
import Space from './model/Space.js';
import View from './view/View.js';
import {data} from './data/data.js';


const space = new Space();
const view = new View(space);
new Controller(space, view);
view.draw();
// load a scene from sceneArea
page.loadSceneButton.dispatchEvent(new MouseEvent('click'));
