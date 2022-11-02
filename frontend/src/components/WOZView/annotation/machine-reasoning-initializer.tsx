import {useEffect} from "react";
import {createAnnotationDataWithMachineReasoning, isAnnotationEmpty} from "./utils";
import {AnnotationData} from "./types";

interface MachineReasoningInitializerProps {
    recordingMeta: any,
    reasoningData: any,
    annotationData: AnnotationData,
    setAnnotationData: (newData: AnnotationData) => void;
}

export default function MachineReasoningInitializer({reasoningData, recordingMeta,
                                                        annotationData, setAnnotationData}:
    MachineReasoningInitializerProps){
    useEffect(() => {
        if (reasoningData && isAnnotationEmpty(annotationData) && recordingMeta) {
            let newAnnotationData = createAnnotationDataWithMachineReasoning(reasoningData, recordingMeta['first-entry']);
            setAnnotationData(newAnnotationData)
        }
    }, [reasoningData, recordingMeta])
    return (
        <div></div>
    )
}