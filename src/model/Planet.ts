export default class Planet {
    
    static getStandardPlanet(): Planet {
        return new Planet('Noname', 5,  5,   0, 400,   5, 5, 'white');
    }

    ax = 0;
    ay = 0;
    
    constructor(
        public name: string,
        public m: number, public r: number,
        public x: number, public y: number,
        public vx: number, public vy: number, 
        public color: string = 'black',
    ) 
    { 
    }

    
}

