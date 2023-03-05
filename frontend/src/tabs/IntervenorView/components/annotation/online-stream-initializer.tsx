import {useEffect} from "react";
import {
    initializeAnnotationDataWithMachineReasoning,
    initializeAnnotationDataWithStreamInfo,
    isAnnotationEmpty
} from "./utils";
import {AnnotationData} from "./types";

interface OnlineStreamInitializerProps {
    streamMeta: any,
    annotationData: AnnotationData,
    setAnnotationData: (newData: AnnotationData) => void;
}

export default function OnlineStreamInitializer({streamMeta,
                                                        annotationData, setAnnotationData}:
    OnlineStreamInitializerProps){
    useEffect(() => {
        if (streamMeta && isAnnotationEmpty(annotationData)) {
            let newAnnotationData = initializeAnnotationDataWithStreamInfo(annotationData, streamMeta['first-entry']);
            setAnnotationData(newAnnotationData)
        }
    }, [streamMeta, annotationData])
    return (
        <div></div>
    )
}