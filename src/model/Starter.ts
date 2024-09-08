import Planet from './Planet.js';


export type Starter = {kind: StarterKind, param1: number, param2: number, startStep: number, planetName: string};

export enum StarterKind  {Empty, Rocket, Nebula };