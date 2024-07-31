
// Основне газове рівняння: P * V = N * BOLTZ * T
// На сторінці:   "g = 0.1, gBall = 0, cell = 20, viz = 10, quant = 5, loss = 0, metr = 1"
export const globus = 
{
    STEP_PERIOD: 20,   // мінім. період одного кроку
    BOLTZ: 1/30, // 0.005,       // стала Больцмана (в житті = 1.380649e−23) // was 1/30
    cell: 20,          // сторона комірки
    g: 0.1,            // сила тяжіння
    gBall: 0,          // чи впливає тяжіння на кулі (0-ні, 1-впливає) 
    metr: 10,          // інтервал між вимірюваннями (у кроках)
    viz: 10,           // малювати кожну vi-ту частку
    quant: 5,          // квант простору             

    N: 0,              // поточна кількість куль
    steps: 0,          // заг. кількість кроків 
    strikes: 0,        // заг. кількість зіткнень    

    // квантує простір при конструюванні сцен
    quanty: function(x: number) { return Math.round(x / this.quant) * this.quant;},
};

export const page = { 
    canvas: <HTMLCanvasElement>document.getElementById('canvas')!,
    hideButton: document.getElementById('hideButton')!,
    dashboard: document.getElementById('dashboard')!,
    runButton: document.getElementById('runButton')!,
    trackButton: document.getElementById('trackButton')!,
    xText: <HTMLInputElement>document.getElementById('x')!,
    yText: <HTMLInputElement>document.getElementById('y')!,
    vxText: <HTMLInputElement>document.getElementById('vx')!,
    vyText: <HTMLInputElement>document.getElementById('vy')!,
    // ---
    nameSpan: document.getElementById('nameSpan')!,
    nameText: <HTMLInputElement>document.getElementById('name')!,
    colorText: <HTMLInputElement>document.getElementById('color')!,
    massaText: <HTMLInputElement>document.getElementById('massa')!,
    radiusText: <HTMLInputElement>document.getElementById('radius')!,
    
}
