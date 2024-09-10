import Planet from "../model/Planet.js";
import Space from '../model/Space.js';
import { Starter } from '../model/Starter.js';

export type PlanetData = {
    name: string;
    m: number;
    r: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
}

export type TaskData = {planets: Planet[], starters: Starter[]};

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
                x: +p.x.toFixed(3),     
                y: +p.y.toFixed(3),
                vx: +p.vx.toFixed(3),
                vy: +p.vy.toFixed(3), 
                color: p.color };
        });

    let json = JSON.stringify({planets: planetDatas, starters: space.starters});

    // insert newlines 
    return json.replaceAll('},', '},\n').replaceAll('],', '],\n');
}

export function deserialization(json: string): TaskData
{
    let x: any = JSON.parse(json);
    if (!("planets" in x)) {
        json = `{"planets":  ${json} , "starters":[]}`;
    }

    let o: TaskData = JSON.parse(json);
    return {planets: planetsFromData(o.planets), 
            starters: o.starters};
}

function planetsFromData(objects: PlanetData[]): Planet[] 
{
    return objects.map(o => {
        return new Planet(o.name, o.m, o.r, o. x, o.y, o.vx, o.vy, o.color);
    })
}