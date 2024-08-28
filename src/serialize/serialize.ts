// serialize true planets only (not rockets, not nebulas)

import Planet from "../model/Planet.js";

//
export function serialization(planets: Planet[]): string 
{
    let objects = planets
        .filter(p => !p.name.startsWith('_'))
        .map(p => {
            return { name: p.name, 
                m: p.m, 
                r: p.r, 
                x: p.x.toFixed(3), 
                y: p.y.toFixed(3), 
                vx: p.vx.toFixed(3), 
                vy: p.vy.toFixed(3), 
                color: p.color };
        });
    let json = JSON.stringify(objects);
    // insert newlines
    return json.replaceAll('},', '},\n');
}

export function deserialization(json: string): Planet[] 
{
    let objects:[] = JSON.parse(json);
    return objects.map(o => {
        let p = new Planet();
        Object.assign(p, o);
        return p;
    })
}