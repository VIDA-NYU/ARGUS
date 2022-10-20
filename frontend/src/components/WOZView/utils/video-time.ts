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

export {useVideoTime}