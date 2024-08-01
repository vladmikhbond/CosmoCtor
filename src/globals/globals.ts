
export const glo = 
{
    STEP_PERIOD: 10,   // мінім. період одного кроку
    G: 0.001,          // стала тяжіння
}

export const page = { 
    canvas: <HTMLCanvasElement>document.getElementById('canvas')!,
    hideButton: document.getElementById('hideButton')!,
    dashboard: document.getElementById('dashboard')!,
    runButton: document.getElementById('runButton')!,
    trackButton: document.getElementById('trackButton')!,
    saveButton: document.getElementById('saveButton')!,
    plusButton: document.getElementById('plusButton')!,
    minusButton: document.getElementById('minusButton')!,
    //
    xText: <HTMLInputElement>document.getElementById('xText')!,
    yText: <HTMLInputElement>document.getElementById('yText')!,
    vxText: <HTMLInputElement>document.getElementById('vxText')!,
    vyText: <HTMLInputElement>document.getElementById('vyText')!,
    // ---
    nameSpan: document.getElementById('nameSpan')!,
    nameText: <HTMLInputElement>document.getElementById('nameText')!,
    colorText: <HTMLInputElement>document.getElementById('colorText')!,
    massaText: <HTMLInputElement>document.getElementById('massaText')!,
    radiusText: <HTMLInputElement>document.getElementById('radiusText')!,
    //
    stepsPerSecSpan: document.getElementById('stepsPerSecSpan')!,
    saveSceneButton: document.getElementById('saveSceneButton')!,
    loadSceneButton: document.getElementById('loadSceneButton')!,
    sceneArea: <HTMLTextAreaElement>document.getElementById('sceneArea')!,
    
}
