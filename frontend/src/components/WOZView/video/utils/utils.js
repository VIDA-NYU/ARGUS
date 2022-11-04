function preprocessObjectData(objData, name){
    return {
        object: name,
        loc2D: {
            x: objData["2D_loc"][0],
            y: objData["2D_loc"][1]
        },
        width: objData["wh_size"][0],
        height: objData["wh_size"][1],
        seen: objData["seen"],
        instruction: objData["instruction"]
    }
}

function preprocessTimestampData(timeData, index){
    let objects = []
    for(let key of Object.keys(timeData)){
        if (key === "time"){

        }else {
            let objectData = preprocessObjectData(timeData[key], key);
            objects.push(objectData)
        }

    }
    return {
        index: index,
        time: timeData["time"],
        objects: objects
    }
}

function _preprocessBoundingBoxData(rawData){
    let videoSequence = []
    for (let key of Object.keys(rawData)){
        let timeData = preprocessTimestampData(rawData[key], parseInt(key));
        videoSequence.push(timeData);
    }
    return videoSequence;
}

export {_preprocessBoundingBoxData}