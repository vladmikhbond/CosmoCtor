import Planet from './Planet.js';


export type Starter = {kind: StarterKind, velo: number, count: number, size: number, startStep: number, planetName: string};

export enum StarterKind  {Empty, Rocket, Nebula };