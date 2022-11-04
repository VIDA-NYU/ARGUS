import {AnnotationData, AnnotationMeta, AnnotationReasoningStep} from "./types";
import {convertTimestampToVideoTime, extractTimestampValue} from "../utils/video-time";

export function createInitialAnnotationData(): AnnotationData{
    return {
        reasoningSteps: [],
        meta: {
            mode: "offline",
            id: "ethan_mugcake_0",
            recipeID: "mugcake",
            entryTime: 0,
            initialized: false,
        }
    }
}

export function initializeAnnotationDataWithMachineReasoning(uninitializedAnnotation: AnnotationData, machineReasoningData, videoEntryTime): AnnotationData{
    let currStep = 0;

    let effectiveReasoningSteps: Array<AnnotationReasoningStep> = []
    for(let reasoningStep of machineReasoningData){
        if(reasoningStep['step_id'] !== currStep){
            let stepTime = convertTimestampToVideoTime(reasoningStep['timestamp'], videoEntryTime);
            effectiveReasoningSteps.push({
                type: "machine_step",
                step: reasoningStep['step_id'],
                prev: currStep,
                time: stepTime
            })
        }

        currStep = reasoningStep['step_id'];
    }

    return {
        reasoningSteps: effectiveReasoningSteps,
        meta: {
            ...uninitializedAnnotation.meta,
            initialized: true
        }
    }
}

export function initializeAnnotationDataWithStreamInfo(uninitializedAnnotation: AnnotationData, videoEntryTime): AnnotationData{
    return {
        ...uninitializedAnnotation,
        reasoningSteps: [],
        meta: {
            ...uninitializedAnnotation.meta,
            entryTime: extractTimestampValue(videoEntryTime),
            initialized: true
        }
    }
}

export function isAnnotationEmpty(annotationData: AnnotationData){
    return annotationData.reasoningSteps.length === 0 || !annotationData.meta.initialized;
}

export function computeCurrentStep(annotationData: AnnotationData, machineReasoningStep, currentTime){
    let effectiveAnnotationSteps = [...annotationData.reasoningSteps.filter(step => step.time <= currentTime)];
    effectiveAnnotationSteps.sort((a, b) => a.time - b.time)
    let currStep = 0;
    for(let annotationReasoningStep of effectiveAnnotationSteps){
        if(annotationReasoningStep.type === "machine_step"){
            currStep = annotationReasoningStep.step;
        }else if(annotationReasoningStep.type === "new_step"){
            currStep = annotationReasoningStep.step
        }else if(annotationReasoningStep.type === "revert"){

        }else if(annotationReasoningStep.type === "human_go_next"){
            currStep += 1;
        }else if(annotationReasoningStep.type === "human_go_prev"){
            if(currStep > 0){
                currStep -= 1;
            }
        }
    }
    return currStep;
}

export function addStepToAnnotation(originalAnnotation, annotationType, annotationTime, prevStep, step): AnnotationData{
    return {
        ...originalAnnotation,
        reasoningSteps: [...originalAnnotation.reasoningSteps, {
            type: annotationType,
            time: annotationTime,
            prev: prevStep,
            step: step
        }]
    }
}

export function computeLatestStepChangeTime(annotationData, currentTime){
    let effectiveAnnotationSteps = [...annotationData.reasoningSteps.filter(step => step.time <= currentTime)];
    effectiveAnnotationSteps.sort((a, b) => a.time - b.time)

    let latestStepChangeTime = 0;
    for(let annotationReasoningStep of effectiveAnnotationSteps){
        if(annotationReasoningStep.type === "machine_step"){
            latestStepChangeTime = annotationReasoningStep.time;
        }else if(annotationReasoningStep.type === "new_step"){
            latestStepChangeTime = annotationReasoningStep.time;
        }else if(annotationReasoningStep.type === "revert"){

        }else if(annotationReasoningStep.type === "human_go_next"){
            latestStepChangeTime = annotationReasoningStep.time;
        }else if(annotationReasoningStep.type === "human_go_prev"){

        }
    }
    return latestStepChangeTime;
}

export function computeCurrentStepSpentTime(annotationData, currentTime){
    let latestStepChangeTime = computeLatestStepChangeTime(annotationData, currentTime);
    return currentTime - latestStepChangeTime;
}

export function resetHumanAnnotation(annotationData: AnnotationData){
    return {
        ...annotationData,
        reasoningSteps: annotationData.reasoningSteps.filter(d => d.type === "machine_step")
    }
}

export function buildNewAnnotationMeta(annotationMeta: AnnotationMeta){
    return {
        ...annotationMeta,
        initialized: false
    }
}