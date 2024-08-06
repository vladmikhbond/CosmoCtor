
export const glo = 
{
    STEP_PERIOD: 10,   // мінім. період одного кроку в мсек
    G: 0.001,          // стала тяжіння
    SCOPE: 1,          // телескоп
    stepsCount: 0
}

export const page = { 
    canvas: <HTMLCanvasElement>document.getElementById('canvas')!,
    hideButton: document.getElementById('hideButton')!,
    dashboard: document.getElementById('dashboard')!,
    planetBoard: document.getElementById('planetBoard')!,
    runButton: document.getElementById('runButton')!,
    stepButton: document.getElementById('stepButton')!,
    trackButton: document.getElementById('trackButton')!,
    rocketButton: document.getElementById('rocketButton')!,
    applyButton: document.getElementById('applyButton')!,
    plusButton: document.getElementById('plusButton')!,
    minusButton: document.getElementById('minusButton')!,
    //
    xText: <HTMLInputElement>document.getElementById('xText')!,
    yText: <HTMLInputElement>document.getElementById('yText')!,
    vxText: <HTMLInputElement>document.getElementById('vxText')!,
    vyText: <HTMLInputElement>document.getElementById('vyText')!,
    vRocketText: <HTMLInputElement>document.getElementById('vRocketText')!,
    // ---
    nameText: <HTMLInputElement>document.getElementById('nameText')!,
    colorText: <HTMLInputElement>document.getElementById('colorText')!,
    massaText: <HTMLInputElement>document.getElementById('massaText')!,
    radiusText: <HTMLInputElement>document.getElementById('radiusText')!,
    //
    stepsCountSpan: document.getElementById('stepsCountSpan')!,
    stepsPerSecSpan: document.getElementById('stepsPerSecSpan')!,
    saveSceneButton: document.getElementById('saveSceneButton')!,
    loadSceneButton: document.getElementById('loadSceneButton')!,
    sceneArea: <HTMLTextAreaElement>document.getElementById('sceneArea')!,
    scopeRange: <HTMLInputElement>document.getElementById('scopeRange')!,

}
