
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

    // on dashboard
    runButton: document.getElementById('runButton')!,
    stepButton: document.getElementById('stepButton')!,
    trackButton: document.getElementById('trackButton')!,
    saveSceneButton: document.getElementById('saveSceneButton')!,
    loadSceneButton: document.getElementById('loadSceneButton')!,
    //
    scopeRange: <HTMLInputElement>document.getElementById('scopeRange')!,
    //
    stepsCountSpan: document.getElementById('stepsCountSpan')!,
    stepsPerSecSpan: document.getElementById('stepsPerSecSpan')!,
    planetsCount: document.getElementById('planetsCount')!,

    // on planet board
    nameText: <HTMLInputElement>document.getElementById('nameText')!,
    colorText: <HTMLInputElement>document.getElementById('colorText')!,
    massaText: <HTMLInputElement>document.getElementById('massaText')!,
    radiusText: <HTMLInputElement>document.getElementById('radiusText')!,
    // hr
    xText: <HTMLInputElement>document.getElementById('xText')!,
    yText: <HTMLInputElement>document.getElementById('yText')!,
    vxText: <HTMLInputElement>document.getElementById('vxText')!,
    vyText: <HTMLInputElement>document.getElementById('vyText')!,
    // hr
    plusButton: document.getElementById('plusButton')!,
    minusButton: document.getElementById('minusButton')!,
    actionSelect: <HTMLSelectElement>document.getElementById('actionSelect')!,
    //
    actionDiv: document.getElementById('actionDiv')!,
    span1: <HTMLSpanElement>document.getElementById('span1')!,
    span2: <HTMLSpanElement>document.getElementById('span2')!,
    field1: <HTMLInputElement>document.getElementById('field1')!,
    field2: <HTMLInputElement>document.getElementById('field2')!,
    actionButton: document.getElementById('actionButton')!,

    // on footer
    sceneArea: <HTMLTextAreaElement>document.getElementById('sceneArea')!,
    

}
