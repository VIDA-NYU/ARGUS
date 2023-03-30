import {_preprocessBoundingBoxData} from "./utils";
import {extractTimestampValue} from "../../utils/video-time";


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


function preprocessFrameObjectWithSchemaXYXYN(objectData){
    return {
        object: objectData.label,
        loc2D: {x: objectData.xyxyn[0], y:objectData.xyxyn[1]},
        width: objectData.xyxyn[2] - objectData.xyxyn[0],
        height: objectData.xyxyn[3] - objectData.xyxyn[1],
        seen: true,
        instruction: ""
    }
}

function preprocessFrameObjectWithSchemaXYZ(objectData){
    return {
        object: objectData.label,
        loc2D: {x: objectData.xyz_center[0], y:objectData.xyz_center[1]},
        width: 10,
        height: 10,
        seen: true,
        instruction: ""
    }
}

function preprocessFrameObject(objectData){
    if(Object.keys(objectData).includes("xyxyn")){
        return preprocessFrameObjectWithSchemaXYXYN(objectData)
    }else{
        return preprocessFrameObjectWithSchemaXYZ(objectData);
    }
}

function preprocessFrameBoundingBoxData(rawData, confidenceThreshold: number | undefined) : TimeRecord{
    const dataAttr = rawData && Object.keys(rawData).indexOf("data") != -1 ? "data" : "values";
    
    if(!confidenceThreshold){
        confidenceThreshold = 0;
    }
    return {
        index: 0,
        time: 0,
        objects: rawData[dataAttr].filter(d => d.confidence > confidenceThreshold).map(d => preprocessFrameObject(d))
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


function syncWithVideoTime(currentTime: number, state: any, videoEntryTime: number, boundingBoxData: any){
    const dataAttr = boundingBoxData && Object.keys(boundingBoxData).indexOf("data") != -1 ? "data" : "values";
    if(!boundingBoxData || !boundingBoxData[dataAttr]){
        return boundingBoxData;
    }
    const threshold = 1000;

    let boundingBoxTimestampValue = extractTimestampValue(boundingBoxData.timestamp);
    if(Math.abs(boundingBoxTimestampValue - currentTime) > threshold){
        return {
            ...boundingBoxData,
            data: []
        }
    }else{
        return boundingBoxData
    }

}
export type {ObjectRecord}
export {preprocessBoundingBoxData, locateFrame, preprocessFrameBoundingBoxData, syncWithVideoTime};