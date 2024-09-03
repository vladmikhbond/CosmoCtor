import {page} from './globals/globals.js';
import Controller from './controller/Controller.js';
import Space from './model/Space.js';
import View from './view/View.js';

const space = new Space();
const view = new View(space);
new Controller(space, view);
view.draw();
// load 
page.loadSceneButton.dispatchEvent(new MouseEvent('click'));

/////////////////////////////////////////////////////////////////////
const M = 1000
const r_e = 300
const v_e = (M / r_e)**0.5
const T_e = 2 * Math.PI * r_e / v_e 
const omega_e = 2 * Math.PI /T_e

const r_m = 400
const v_m = (M / r_m)**0.5
const T_m = 2 * Math.PI * r_m / v_m
const omega_m = 2 * Math.PI /T_m

const r_ro = 350
const T_r = T_e * (r_ro/r_e)**(3/2)

const fi = Math.PI - omega_m * T_m / 2

// console.log('T T T:', T_e, T_r, T_m) 
console.log('fi=' + fi)     // fi=0.5702381689093876
console.log('v_e v_m: ', v_e, v_m )
const omega_em = omega_e - omega_m;
const t_start = (2 * Math.PI - fi) / omega_em
console.log('t_start: ', t_start)