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

// /////////////////////////////////////////////////////////////////////
// const M = 1000
// const r_e = 300
// const v_e = (M / r_e)**0.5
// const T_e = 2 * Math.PI * r_e / v_e 
// const omega_e = 2 * Math.PI /T_e

// const r_m = 400
// const v_m = (M / r_m)**0.5
// const T_m = 2 * Math.PI * r_m / v_m
// const omega_m = 2 * Math.PI /T_m

// const r_ro = 350
// const T_ro = T_e * (r_ro/r_e)**(3/2)
// const v_ro = Math.sqrt(2*M * 400 / 700 / 300) - v_e;  // v_ro = 0.126
// //--- расчетній угол отставания З от М
// const fi = Math.PI - omega_m * T_ro / 2       // fi=0.5702381689093876

// console.log('fi=' + fi)     

// //---


// console.log('v_e v_m  v_ro: ', v_e, v_m, v_ro )
// const omega_em = omega_e - omega_m;
// console.log('omega_e omega_m  omega_em: ', omega_e, omega_m, omega_em )

// const t_start = (2 * Math.PI - fi) / omega_em
// console.log('t_start: ', t_start)  // 2678.413799214397