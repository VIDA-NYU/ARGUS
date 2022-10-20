import {useEffect, useRef, useState} from "react";
import {Dataset} from "../../HandsDataView/model/dataset";

function preprocessTimestampData (data, recordingMetaData, playedTimes){

    let dataset = new Dataset(recordingMetaData, data);
    const result = []

    const rawFirstEntryTimestamp: string = recordingMetaData['first-entry'].split('-')[0]
    const rawLastEntryTimestamp: string = recordingMetaData["last-entry"].split('-')[0]
    const duration = parseInt(rawLastEntryTimestamp) - parseInt(rawFirstEntryTimestamp);

    for(let playedTime of playedTimes){
        let currentTime = playedTime * duration / 1000;

        const {
            element: currFrameData,
            index: currFrameIndex
        } = dataset.get_corresponding_timestamp(currentTime);
        result.push(currFrameData);
    }
    return result
}


function extractIndividualActionData(wholeActionData){
    let actionLabels = Object.keys(wholeActionData[0]).filter(d=>d!=="timestamp");
    let result = [];
    for(let label of actionLabels){
        result.push({
            "label": label,
            data: wholeActionData.map(d=>d[label])
        })
    }
    return result
}

export {preprocessTimestampData, extractIndividualActionData}
