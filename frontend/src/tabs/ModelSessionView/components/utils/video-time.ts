import {useEffect, useRef, useState} from "react";
import {Dataset} from "./model/dataset";

function useVideoTime (currentTime, data, recordingMetaData){
    const [frameIndex, setFrameIndex] = useState<number>(0);
    const [frameData, setFrameData] = useState(undefined);
    const dataset = useRef(null);


    useEffect(() => {
        if (data) {
            dataset.current = new Dataset(recordingMetaData, data);
            if(data.length === 0){
                setFrameData(undefined);
                setFrameIndex(-1);
            }

        }
    }, [data, recordingMetaData]);

    useEffect(() => {
        if (dataset.current && recordingMetaData && recordingMetaData['first-entry']) {
            let currentTimeSeconds = (currentTime - extractTimestampValue(recordingMetaData['first-entry']))/1000;
            const {
                element: currFrameData,
                index: currFrameIndex
            } = dataset.current.get_corresponding_timestamp(currentTimeSeconds);
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

function parseVideoStateTime(value: string | number){
    if(typeof value === "string"){
        return 0;
    }else{
        return value
    }
}

export {useVideoTime, convertTimestampToVideoTime, extractTimestampValue, parseVideoStateTime}