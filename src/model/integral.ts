function int(M:number, R:number, a:number, n:number):number {
    const dw = Math.PI / n, dz = R / n,  dm = M / (n**2);
    let fx = 0;
    for (let w = 0; w < Math.PI; w += dw) {
        for (let z = 0; z < R; z += dz) {
            let r = Math.sqrt(z * z + a * a - 2 * a * z * Math.cos(w));
            if (r) {
                let rx = a - z * Math.cos(w + dw/2);
                fx += rx/(r**3) * dm;
            }
        } 
    } 
    fx *= 2 * M / R;
    return fx;
}

for (let a = 1; a < 500; a += 10) {
   console.log(a, int(100, 500, a, 200))
}