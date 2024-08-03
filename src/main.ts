import {page} from './globals/globals.js';
import Controller from './controller/Controller.js';
import Planet from './model/Planet.js';
import Space from './model/Space.js';
import View from './view/View.js';

page.canvas.width = page.canvas.height = 1000;
const space = new Space();
const view = new View(space);
new Controller(space, view);
view.draw();
// page.loadSceneButton.dispatchEvent(new MouseEvent('click'));
