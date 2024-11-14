
export type Starter = {kind: StarterKind, velo: number, count: number, size: number, startStep: number, planetName: string, distr: string};

export enum StarterKind  {Empty, Rocket, Nebula };