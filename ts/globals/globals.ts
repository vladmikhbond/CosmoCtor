const _canvas = <HTMLCanvasElement>document.getElementById('canvas')!;

export const glo = 
{
    STEP_PERIOD: 10,      // мінім. період одного кроку в мсек
    G: 1,                 // стала тяжіння
    scale: 1,             // телескоп
    shiftX: _canvas.width / 2,
    shiftY: _canvas.height / 2,
    stepsCount: 0,        // кількість кроків

    retransformXY(x: number, y:number) {
        let x1 = (x - this.shiftX) / this.scale;
        let y1 = -(y - this.shiftY) / this.scale;        
        return {x: x1, y: y1};
    }
}


export const page = { 
    menuDiv: <HTMLDivElement>document.getElementById('menuDiv')!,
    menuSpan: <HTMLSpanElement>document.getElementById('menuSpan')!,
    helpButton: <HTMLButtonElement>document.getElementById('helpButton')!,
    taskDiv: <HTMLDivElement>document.getElementById('taskDiv')!,
    condDiv: <HTMLDivElement>document.getElementById('condDiv')!,
    helpDiv: <HTMLDivElement>document.getElementById('helpDiv')!,
    solvDiv: <HTMLDivElement>document.getElementById('solvDiv')!,

    openHelpButton: <HTMLButtonElement>document.getElementById('openHelpButton')!,
    openSolvButton: <HTMLButtonElement>document.getElementById('openSolvButton')!,
    closeTaskButton: <HTMLButtonElement>document.getElementById('closeTaskButton')!,


    canvas: _canvas,
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
    clearAllButton: document.getElementById('clearAllButton')!,
    stepsCountSpan: document.getElementById('stepsCountSpan')!,
    stepsPerSecSpan: document.getElementById('stepsPerSecSpan')!,
    planetsCountSpan: document.getElementById('planetsCountSpan')!,

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
    planetButton: document.getElementById('planetButton')!,
    rocketButton: document.getElementById('rocketButton')!,
    nebulaButton: document.getElementById('nebulaButton')!,
    delButton: document.getElementById('delButton')!,

    // rocket starter board
    rocketBoard: document.getElementById('rocketBoard')!,
    velo: <HTMLInputElement>document.getElementById('velo')!,
    interval1: <HTMLInputElement>document.getElementById('interval1')!,
    okButton1: document.getElementById('okButton1')!,
    cancelButton1: document.getElementById('cancelButton1')!,

    // nebula starter board
    nebulaBoard: document.getElementById('nebulaBoard')!,
    count: <HTMLInputElement>document.getElementById('count')!,
    size: <HTMLInputElement>document.getElementById('size')!,
    moment: <HTMLInputElement>document.getElementById('moment')!,
    distr: <HTMLInputElement>document.getElementById('distr')!,
    interval2: <HTMLInputElement>document.getElementById('interval2')!,
    okButton2: document.getElementById('okButton2')!,
    cancelButton2: document.getElementById('cancelButton2')!,

    // on footer
    savedSceneArea: <HTMLTextAreaElement>document.getElementById('savedSceneArea')!,
    dataArea: <HTMLTextAreaElement>document.getElementById('dataArea')!,

}
