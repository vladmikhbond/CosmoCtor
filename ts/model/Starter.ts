
export type Starter = {
    kind: StarterKind, 
    planetName: string, 
    startStep: number, 
    velo: number, 
    count: number, 
    size: number, 
    distr: string
};

export enum StarterKind  {Empty, Rocket, Nebula };
