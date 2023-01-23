import {Dataset} from '../../../HistoricalDataView/components/HandsDataView/model/dataset';

function preprocessTimestampData (data, recordingMetaData, playedTimes, totalDuration){

    let dataset = new Dataset(recordingMetaData, data);
    const result = []

    const rawFirstEntryTimestamp: string = recordingMetaData['first-entry'].split('-')[0]
    const rawLastEntryTimestamp: string = recordingMetaData["last-entry"].split('-')[0]
    const duration = totalDuration && parseInt(totalDuration) ? totalDuration * 1000: parseInt(rawLastEntryTimestamp) - parseInt(rawFirstEntryTimestamp)
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
function extractIndividualActionData(wholeActionData){
    let actionLabels = extractAllLabels(wholeActionData);
    let result = [];
    for(let label of actionLabels){
        result.push({
            "label": label,
            data: wholeActionData.map(d=>d[label] ? d[label] : 0)
        })
    }
    return result
}

export {preprocessTimestampData, extractIndividualActionData}
