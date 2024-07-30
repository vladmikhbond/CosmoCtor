import Controller from './controller/Controller.js';
import Planet from './model/Planet.js';
import Space from './model/Space.js';
import View from './view/View.js';

let sun =   new Planet('Sun', 10**6, 5, 0, 0, 0, 0);
let earth = new Planet('Earth', 10,  2, 300, 0, 0, 1.5);
let venus = new Planet('Venus', 10,  2, 200, 0, 0, 1.7);

const space = new Space(sun, earth, venus);
const view = new View(space);
const controller = new Controller(space, view);

view.draw();
