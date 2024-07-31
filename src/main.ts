import {page} from './globals/globals.js';
import Controller from './controller/Controller.js';
import Planet from './model/Planet.js';
import Space from './model/Space.js';
import View from './view/View.js';

let sun =   new Planet('Sun', 10**6, 7,     0, 0, 0, 0, 'yellow');
let venus = new Planet('Venus', 10,  2,     200, 0,   0, (1000/200)**0.5, 'green');
let earth = new Planet('Earth', 10,  2,     300, 0,   0, (1000/300)**0.5, 'lightblue');

let jupiter = new Planet('Jupiter', 100, 4, 500, 0,   0, (1000/500)**0.5, 'pink');

page.canvas.width = page.canvas.height = 1000;


const space = new Space(sun, earth, venus, jupiter);
const view = new View(space);
new Controller(space, view);

view.draw();
