import {_preprocessBoundingBoxData} from "./utils";

interface Loc2D {
    x: number,
    y: number
}

interface Loc3D {
    x: number,
    y: number,
    z: number
}

interface ObjectRecord {
    object: string,
    loc2D: Loc2D,
    width: number,
    height: number,
    seen: boolean,
    instruction: string
}

interface TimeRecord {
    index: number,
    time: number,
    objects: Array<ObjectRecord>
}

function preprocessBoundingBoxData(rawData) : Array<TimeRecord>{
    return _preprocessBoundingBoxData(rawData);
}

function preprocessFrameObject(objectData){
    return {
        object: objectData.label,
        loc2D: {x: objectData.xyxyn[0], y:objectData.xyxyn[1]},
        width: objectData.xyxyn[2] - objectData.xyxyn[0],
        height: objectData.xyxyn[3] - objectData.xyxyn[1],
        seen: true,
        instruction: ""
    }
}

function preprocessFrameBoundingBoxData(rawData) : TimeRecord{
    return {
        index: 0,
        time: 0,
        objects: rawData.data.map(d => preprocessFrameObject(d))
    }
}
function locateFrame(boundingBoxSequence: Array<TimeRecord>, played: number){
    for(let timeRecord of boundingBoxSequence){
        if (timeRecord.time >= played){
            return timeRecord
        }
    }
    return undefined
    return boundingBoxSequence[boundingBoxSequence.length - 1];
}

export {preprocessBoundingBoxData, locateFrame, preprocessFrameBoundingBoxData};