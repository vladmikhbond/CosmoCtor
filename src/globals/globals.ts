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
    planetButton: document.getElementById('planetButton')!,
    rocketButton: document.getElementById('rocketButton')!,
    nebulaButton: document.getElementById('nebulaButton')!,
    delButton: document.getElementById('delButton')!,

    // action
    actionBoard: document.getElementById('actionBoard')!,
    span1: <HTMLSpanElement>document.getElementById('span1')!,
    span2: <HTMLSpanElement>document.getElementById('span2')!,
    span3: <HTMLSpanElement>document.getElementById('span3')!,
    field1: <HTMLInputElement>document.getElementById('field1')!,
    field2: <HTMLInputElement>document.getElementById('field2')!,
    field3: <HTMLInputElement>document.getElementById('field3')!,
    okButton: document.getElementById('okButton')!,
    cancelButton: document.getElementById('cancelButton')!,
    

    // on footer
    sceneArea: <HTMLTextAreaElement>document.getElementById('sceneArea')!,



}
