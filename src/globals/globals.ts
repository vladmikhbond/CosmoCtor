
export const glo = 
{
    STEP_PERIOD: 10,   // мінім. період одного кроку
    G: 0.001,          // стала тяжіння
}

export const STEP_PERIOD = 20;   // мінім. період одного кроку

export const page = { 
    canvas: <HTMLCanvasElement>document.getElementById('canvas')!,
    hideButton: document.getElementById('hideButton')!,
    dashboard: document.getElementById('dashboard')!,
    runButton: document.getElementById('runButton')!,
    trackButton: document.getElementById('trackButton')!,
    saveButton: document.getElementById('saveButton')!,
    plusButton: document.getElementById('plusButton')!,
    minusButton: document.getElementById('minusButton')!,



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
    //
    stepsPerSecSpan: document.getElementById('stepsPerSecSpan')!,
    
}
