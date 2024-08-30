
import {PlanetData} from '../data/data.js';

import Planet from "../model/Planet.js";

// Serialize true planets only (not rockets, not nebulas)
//
export function serialization(planets: Planet[]): string 
{
    let objects = planets
        .filter(p => !p.name.startsWith('_'))
        .map(p => {
            return { name: p.name, 
                m: p.m, 
                r: p.r, 
                x: (p.x * 1000 | 0) / 1000, 
                y: (p.y * 1000 | 0) / 1000,
                vx: (p.vx * 1000 | 0) / 1000,
                vy: (p.vy * 1000 | 0) / 1000, 
                color: p.color };
        });
    let json = JSON.stringify(objects);
    // insert newlines
    return json.replaceAll('},', '},\n');
}

export function deserialization(json: string): Planet[] 
{
    let datas: PlanetData[] = JSON.parse(json);
    return planetsFromData(datas);
}

export function planetsFromData(objects: PlanetData[]): Planet[] 
{
    return objects.map(o => {
        let p = new Planet();
        Object.assign(p, o);
        return p;
    })
}