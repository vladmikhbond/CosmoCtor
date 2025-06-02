const _canvas = <HTMLCanvasElement>document.getElementById('canvas')!;

export const glo = 
{
    STEP_PERIOD: 10,      // мінім. період одного кроку в мсек
    G: 1,                 // стала тяжіння
    scale: 1,             // телескоп
    shiftX: _canvas.width / 2,
    shiftY: _canvas.height / 2,
    chronos: 0,        // кількість кроків

    retransformXY(x: number, y:number) {
        let x1 = (x - this.shiftX) / this.scale;
        let y1 = -(y - this.shiftY) / this.scale;        
        return {x: x1, y: y1};
    }
}


export const doc = { 
    menuDiv: <HTMLDivElement>document.getElementById('menuDiv')!,
    menuSpan: <HTMLSpanElement>document.getElementById('menuSpan')!,
    helpButton: <HTMLButtonElement>document.getElementById('helpButton')!,
    taskDiv: <HTMLDivElement>document.getElementById('taskDiv')!,
    // condDiv: <HTMLDivElement>document.getElementById('condDiv')!,
    helpDiv: <HTMLDivElement>document.getElementById('helpDiv')!,
    solvDiv: <HTMLDivElement>document.getElementById('solvDiv')!,

    openHelpButton: <HTMLButtonElement>document.getElementById('openHelpButton')!,
    openSolvButton: <HTMLButtonElement>document.getElementById('openSolvButton')!,
    closeTaskButton: <HTMLButtonElement>document.getElementById('closeTaskButton')!,

    canvas: _canvas,
    dashboard: document.getElementById('dashboard')!,
    planetBoard: document.getElementById('planetBoard')!,

    // on top panel
    runButton: document.getElementById('runButton')!,
    restartButton: document.getElementById('restartButton')!,
    stepButton: document.getElementById('stepButton')!,
    trackButton: document.getElementById('trackButton')!,
    sceneSelect: <HTMLSelectElement>document.getElementById("sceneSelect"),
    //
    scopeRange: <HTMLInputElement>document.getElementById('scopeRange')!,
    //
    mousePosSpan: <HTMLSpanElement>document.getElementById("mousePosSpan"),
    infoSpan: document.getElementById('infoSpan')!,

    // on problem board
    problemBoard: <HTMLDivElement>document.getElementById("problemBoard"),
    condDiv: <HTMLDivElement>document.getElementById("condDiv"),
    answerButton: <HTMLButtonElement>document.getElementById("answerButton"),
    checkmarkImg: <HTMLImageElement>document.getElementById("checkmark"),
    crossmarkImg: <HTMLImageElement>document.getElementById("crossmark"),

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
    applyButton: document.getElementById('applyButton')!,

    // rocket starter board
    rocketBoard: document.getElementById('rocketBoard')!,
    velo: <HTMLInputElement>document.getElementById('velo')!,
    interval1: <HTMLInputElement>document.getElementById('interval1')!,
    okButton1: document.getElementById('okButton1')!,


    // nebula starter board
    nebulaBoard: document.getElementById('nebulaBoard')!,
    count: <HTMLInputElement>document.getElementById('count')!,
    size: <HTMLInputElement>document.getElementById('size')!,
    moment: <HTMLInputElement>document.getElementById('moment')!,
    distr: <HTMLInputElement>document.getElementById('distr')!,
    interval2: <HTMLInputElement>document.getElementById('interval2')!,
    okButton2: document.getElementById('okButton2')!,


    // bottom 
    saveSceneButton: document.getElementById('saveSceneButton')!,
    savedSceneArea: <HTMLTextAreaElement>document.getElementById('savedSceneArea')!,
    restoreSceneButton: document.getElementById('restoreSceneButton')!,
}
