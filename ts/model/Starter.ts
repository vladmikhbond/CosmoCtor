
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

// export class Starter {
//     kind: StarterKind;
//     velo: number;
//     count: number;
//     size: number;
//     startStep: number;
//     planetName: string;
//     distr: string;

//     constructor(
//         kind: StarterKind,
//         velo: number,
//         count: number,
//         size: number,
//         startStep: number,
//         planetName: string,
//         distr: string
//     ) {
//         this.kind = kind;
//         this.velo = velo;
//         this.count = count;
//         this.size = size;
//         this.startStep = startStep;
//         this.planetName = planetName;
//         this.distr = distr;
//     }
// }