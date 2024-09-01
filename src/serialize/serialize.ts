
import {PlanetData} from '../data/data.js';

import Planet from "../model/Planet.js";
import Space from '../model/Space.js';
import { Starter } from '../model/Starter.js';

// Serialize true planets only (not rockets, not nebulas)
//
export function serialization(space: Space): string 
{
    let planetDatas = space.planets
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

    let json = JSON.stringify({planets: planetDatas, starters: space.starters});
    // insert newlines
    return json.replaceAll('},', '},\n');
}

export function deserialization(json: string)
{
    let x: any = JSON.parse(json);
    if (!("planets" in x)) {
        json = `{"planets":  ${json} , "starters":[]}`;
    }

    let o: {planets: PlanetData[]; starters: Starter[]} = JSON.parse(json);
    return {planets: planetsFromData(o.planets), 
            starters: o.starters};
}

export function planetsFromData(objects: PlanetData[]): Planet[] 
{
    return objects.map(o => {
        let p = new Planet();
        Object.assign(p, o);
        return p;
    })
}