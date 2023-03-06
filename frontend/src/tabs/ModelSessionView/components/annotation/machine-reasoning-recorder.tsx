import {useEffect, useState} from "react";
import {initializeAnnotationDataWithMachineReasoning, isAnnotationEmpty} from "./utils";
import {AnnotationData} from "./types";
import {convertTimestampToVideoTime} from "../utils/video-time";

interface MachineReasoningInitializerProps {
    reasoningFrameData: any,
    annotationData: AnnotationData,
    setAnnotationData: (newData: AnnotationData) => void,
    currentTime: number
}

export default function MachineReasoningRecorder({
                                                     reasoningFrameData, currentTime,
                                                     annotationData, setAnnotationData
                                                 }:
                                                     MachineReasoningInitializerProps) {

    const [latestMachineStep, setLatestMachineStep] = useState<number>(0);
    useEffect(() => {
        if (reasoningFrameData) {
            let machineReasoningStep = reasoningFrameData["step_id"];
            if (machineReasoningStep !== latestMachineStep) {
                setAnnotationData(
                    {
                        ...annotationData,
                        reasoningSteps: [
                            ...annotationData.reasoningSteps, {
                                type: "machine_step",
                                step: machineReasoningStep,
                                prev: latestMachineStep,
                                time: (currentTime - annotationData.meta.entryTime)/1000,
                            }
                        ]
                    }
                )
                setLatestMachineStep(machineReasoningStep);
            }
        }
    }, [annotationData, reasoningFrameData])
    return (
        <div></div>
    )
}