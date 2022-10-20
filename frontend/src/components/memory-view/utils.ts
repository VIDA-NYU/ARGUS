import {MemoryObject} from "./types";

function processMemoryStream(rawData){
    let memoryObjects: Array<MemoryObject> = []
    for(let rawObject of rawData){
        memoryObjects.push({
            trackId: rawObject.track_id,
            label: rawObject.label,
            seenBefore: rawObject.seen_before,
            center: {
                x: rawObject.xyz_center[0],
                y: rawObject.xyz_center[1],
                z: rawObject.xyz_center[2]
            }
        })
    }
    return memoryObjects
}
export {processMemoryStream}