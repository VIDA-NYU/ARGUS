import { Dataset } from '../../../../components/HandsDataView/model/dataset';

function preprocessTimestampData (data, recordingMetaData, playedTimes, totalDuration){

    let dataset = new Dataset(recordingMetaData, data);
    const result = []
    const rawFirstEntryTimestamp: string = recordingMetaData['first-entry'].split('-')[0]
    const rawLastEntryTimestamp: string = recordingMetaData["last-entry"].split('-')[0]
    // const duration = totalDuration && parseInt(totalDuration) ? totalDuration * 1000: parseInt(rawLastEntryTimestamp) - parseInt(rawFirstEntryTimestamp);
    const duration = totalDuration && parseInt(rawLastEntryTimestamp) - parseInt(rawFirstEntryTimestamp); // get total duration from json files.

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

function extractAllLabels(wholeActionData){
    const labels = []
    for(let timedActionData of wholeActionData){
        let timedLabels = Object.keys(timedActionData).filter(d => d != "timestamp");
        for(let label of timedLabels){
            if(!labels.includes(label)){
                labels.push(label);
            }
        }
    }
    return labels;

}

function extractAllObjectLabels(wholeBoundingBoxData){
    const labels = []
    for(let timedBoundingBoxData of wholeBoundingBoxData){
        // let timedLabels = Object.keys(timedBoundingBoxData).filter(d => d != "timestamp");
        let timedLabels = timedBoundingBoxData.values;
        for(let objLabel of timedLabels){
            if(!labels.includes(objLabel.label)){
                labels.push(objLabel.label);
            }
        }
    }
    return labels;

}

function extractAllStepLabels(wholeBoundingBoxData){
    const labels = []
    for(let timedActionData of wholeBoundingBoxData){
        let label = timedActionData["step_id"].toString();
        // let timedLabels = Object.keys(timedActionData).filter(d => d != "timestamp");
        // for(let label of timedLabels){
            if(!labels.includes(label)){
                labels.push(label);
            }
        // }
    }
    return labels;

}

function extractIndividualActionData(wholeActionData){
    let actionLabels = extractAllLabels(wholeActionData);
    let result = [];
    for(let label of actionLabels){
        result.push({
            "label": label,
            data: wholeActionData.map(d=>d[label] ? d[label] : 0),
            timestamps: wholeActionData.map(d => d.timestamp )
        })
    }
    return result
}

function extractIndividualBoundingBoxData(wholeBoundingBoxData){
    let objectLabels = extractAllObjectLabels(wholeBoundingBoxData);
    let result = [];
    const dataAttr = Object.keys(wholeBoundingBoxData[0]).indexOf("data") != -1 ? "data" : "values";
    for(let objLabel of objectLabels){
        result.push({
            "label": objLabel,
            data: wholeBoundingBoxData.map(d=> d[dataAttr].map((o) => o.label).indexOf(objLabel) != -1 ?
            d[dataAttr][d[dataAttr].map((o) => o.label).indexOf(objLabel)].confidence : 0),
            timestamps: wholeBoundingBoxData.map(d => d.timestamp )
        })
    }
    return result
}

function extractIndividualReasoningData(wholeReasoningData){
    let reasoningLabels = extractAllStepLabels(wholeReasoningData);
    let result = [];
    for(let label of reasoningLabels){

        result.push({
            "label": label,
            data: wholeReasoningData.map(d=>(d.step_id).toString() === label ? 1 : 0),
            timestamps: wholeReasoningData.map(d => d.timestamp )
        })
    }
    return result
}

export {preprocessTimestampData, extractIndividualActionData, extractIndividualBoundingBoxData, extractIndividualReasoningData, extractAllStepLabels}
