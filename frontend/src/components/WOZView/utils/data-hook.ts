import {useVideoTime} from "./video-time";
import {useGetRecordingJson} from "./rest";
import {useGetAllRecordings, useGetRecipeInfo, useGetRecording, useStreamData} from "../../../api/rest";
import {useEffect, useState} from "react";

function useRecordingData (recordingID: string, token:string, fetchAuth: any){
    const {response: recordingData} = useGetRecording(token, fetchAuth, recordingID);
    const {data: egovlpActionData} = useGetRecordingJson(recordingID, "egovlp:action:steps");

    const {data: clipActionData} = useGetRecordingJson(recordingID, "clip:action:steps");

    const {data: memoryData} = useGetRecordingJson(recordingID, "detic:memory");

    const {data: eyeData} = useGetRecordingJson(recordingID, "eye");

    const {data: reasoningData} = useGetRecordingJson(recordingID, "reasoning");

    const {data: boundingBoxData} = useGetRecordingJson(recordingID, "detic:world");

    return {
        egovlpActionData, reasoningData, eyeData,
        clipActionData, boundingBoxData, memoryData,
        recordingData
    }

}

function useRecordingFrameData(currentTime, recordingData, reasoningData, memoryData,
                               boundingBoxData, egovlpActionData, clipActionData, eyeData){
    const {
        frameIndex: clipActionFrameIndex,
        frameData: clipActionFrameData
    } = useVideoTime(currentTime, clipActionData, recordingData);

    const {
        frameIndex: egovlpActionFrameData,
        frameData: actionFrameData
    } = useVideoTime(currentTime, egovlpActionData, recordingData)

    const {
        frameIndex: memoryFrameIndex,
        frameData: memoryFrameData
    } = useVideoTime(currentTime, memoryData, recordingData);

    const {
        frameIndex: reasoningFrameIndex,
        frameData: reasoningFrameData
    } = useVideoTime(currentTime, reasoningData, recordingData);

    const {
        frameIndex: boundingBoxFrameIndex,
        frameData: boundingBoxFrameData
    } = useVideoTime(currentTime, boundingBoxData, recordingData);

    const {frameIndex: eyeFrameIndex, frameData: eyeFrameData} =
        useVideoTime(currentTime, eyeData, recordingData);


    return {
        reasoningFrameData, egovlpActionFrameData, clipActionFrameData,
        memoryFrameData, boundingBoxFrameData, eyeFrameData,
    }
}

export const prettyJSON = msg => msg ? JSON.stringify(JSON.parse(msg), null, 2) : msg

function parseStreamBuffer(arrayBufferData: ArrayBuffer | undefined){
    if(arrayBufferData){
        let str = new TextDecoder().decode(arrayBufferData) ;
        return JSON.parse(str)
    }else{
        return undefined
    }
}

function useStreamFrameData(){
    const [cachedTime, setCachedTime] = useState<string>();
    const {data: reasoningFrameBuffer, time } = useStreamData({ streamId: "reasoning",
        parse: null });

    useEffect(() => {
        if(time){
            setCachedTime(time);
        }
    }, [time])
    const reasoningFrameData = parseStreamBuffer(reasoningFrameBuffer)

    const { data: egovlpActionBuffer } = useStreamData({ streamId: "egovlp:action:steps",
        parse: null });
    const egovlpActionFrameData = parseStreamBuffer(egovlpActionBuffer)

    const { data: memoryBuffer } = useStreamData({ streamId: "detic:memory",
        parse: null });
    const memoryFrameData = parseStreamBuffer(memoryBuffer);

    const { data: boundingBoxBuffer } = useStreamData({ streamId: "detic:world",
        parse: null });
    const _boundingBoxFrameData = parseStreamBuffer(boundingBoxBuffer);
    const boundingBoxFrameData = {data: _boundingBoxFrameData};
    const { data: eyeBuffer } = useStreamData({ streamId: "eye",
        parse: null });
    const eyeFrameData = parseStreamBuffer(eyeBuffer);

    const { data: clipActionBuffer } = useStreamData({ streamId: "clip:action:steps",
        parse: null });
    const clipActionFrameData = parseStreamBuffer(clipActionBuffer);

    return {reasoningFrameData, egovlpActionFrameData, memoryFrameData, boundingBoxFrameData, eyeFrameData,
        clipActionFrameData, currentTime: cachedTime}
}

function useFrameData(mode: "online" | "offline" | "undefined", currentTime, recordingData, reasoningData, memoryData,
                   boundingBoxData, egovlpActionData, clipActionData, eyeData){

    const {
        reasoningFrameData: recordingReasoningFrameData,
        egovlpActionFrameData: recordingEgovlpActionFrameData,
        clipActionFrameData: recordingClipActionFrameData,
        eyeFrameData: recordingEyeFrameData,
        memoryFrameData: recordingMemoryFrameData,
        boundingBoxFrameData: recordingBoundingBoxFrameData
    } = useRecordingFrameData(
        currentTime, recordingData, reasoningData, memoryData,
        boundingBoxData, egovlpActionData, clipActionData, eyeData
    );

    const {
        reasoningFrameData: streamReasoningFrameDatam,
        egovlpActionFrameData: streamEgovlpActionFrameData,
        memoryFrameData: streamMemoryFrameData,
        boundingBoxFrameData: streamBoundingBoxFrameData,
        clipActionFrameData: streamClipActionFrameData,
        eyeFrameData: streamEyeFrameData,
        currentTime: streamCurrentTime
    } = useStreamFrameData();
    if(mode === "online"){
        return {
            reasoningFrameData: streamReasoningFrameDatam,
            egovlpActionFrameData: streamEgovlpActionFrameData,
            memoryFrameData: streamMemoryFrameData,
            boundingBoxFrameData: streamBoundingBoxFrameData,
            clipActionFrameData: streamClipActionFrameData,
            eyeFrameData: streamEyeFrameData,
            currentTime: streamCurrentTime
        }
    }else{
        return {
            reasoningFrameData: recordingReasoningFrameData,
            egovlpActionFrameData: recordingEgovlpActionFrameData,
            clipActionFrameData: recordingClipActionFrameData,
            eyeFrameData: recordingEyeFrameData,
            memoryFrameData: recordingMemoryFrameData,
            boundingBoxFrameData: recordingBoundingBoxFrameData,
            currentTime: currentTime
        }
    }
}

export {useRecordingData, useRecordingFrameData, useStreamFrameData, useFrameData};