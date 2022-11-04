import {useEffect, useRef, useState} from "react";
import {isEmpty} from "../../HandsDataView/visualization/utils";
import {Dataset} from "../../HandsDataView/model/dataset";

function useVideoTime (currentTime, data, recordingMetaData){
    const [frameIndex, setFrameIndex] = useState<number>(0);
    const [frameData, setFrameData] = useState(undefined);
    const dataset = useRef(null);

    useEffect(() => {
        if (data) {
            dataset.current = new Dataset(recordingMetaData, data);
        }
    }, [data, recordingMetaData]);

    useEffect(() => {

        if (dataset.current && recordingMetaData && recordingMetaData['first-entry']) {
            const {
                element: currFrameData,
                index: currFrameIndex
            } = dataset.current.get_corresponding_timestamp(currentTime);
            if (currFrameIndex >= 0) {
                setFrameData(currFrameData);
                setFrameIndex(currFrameIndex);
            }

        }
    }, [currentTime, dataset]);


    return {
        frameIndex, frameData
    }
}

function extractTimestampValue(timestampStr){
    return parseInt(timestampStr.split('-')[0])
}

function convertTimestampToVideoTime(timestamp, videoEntryTimestamp){

    let videoEntryTimestampValue = extractTimestampValue(videoEntryTimestamp);
    let timestampValueToUse = extractTimestampValue(timestamp);

    return (timestampValueToUse - videoEntryTimestampValue) / 1000;

}

export {useVideoTime, convertTimestampToVideoTime, extractTimestampValue}