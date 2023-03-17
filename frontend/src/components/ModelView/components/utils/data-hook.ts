import {useVideoTime} from "./video-time";
import {useGetRecording, useGetRecordingJson, useStreamData} from  '../../../../api/rest';
import {useEffect, useState} from "react";

function preprocessResponse(response: any){
    if(response && Object.keys(response).includes("detail") && response["detail"] === "Not Found"){
        return []
    }else{
        return response;
    }
}

function useRecordingData (recordingID: string, token:string, fetchAuth: any){
    const {response: recordingData} = useGetRecording(token, fetchAuth, recordingID);
    const {data: egovlpActionResponse} = useGetRecordingJson(recordingID, "egovlp:action:steps");
    const egovlpActionData = preprocessResponse(egovlpActionResponse);

    const {data: clipActionResponse} = useGetRecordingJson(recordingID, "clip:action:steps");
    const clipActionData = preprocessResponse(clipActionResponse)

    const {data: memoryResponse} = useGetRecordingJson(recordingID, "detic:memory");
    const memoryData = preprocessResponse(memoryResponse)

    const {data: eyeResponse} = useGetRecordingJson(recordingID, "eye");
    const eyeData = preprocessResponse(eyeResponse)

    const {data: reasoningResponse} = useGetRecordingJson(recordingID, "reasoning");
    const reasoningData = preprocessResponse(reasoningResponse);

    const {data: boundingBoxResponse} = useGetRecordingJson(recordingID, "detic:image");
    const boundingBoxData = preprocessResponse(boundingBoxResponse);

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
        frameIndex: egovlpActionFrameIndex,
        frameData: egovlpActionFrameData
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

    const { data: boundingBoxBuffer, time: boundingBoxTime } = useStreamData({ streamId: "detic:image",
        parse: null });
    const _boundingBoxFrameData = parseStreamBuffer(boundingBoxBuffer);
    const boundingBoxFrameData = {data: _boundingBoxFrameData, timestamp: `${boundingBoxTime}-0`};

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

    // const {
    //     reasoningFrameData: streamReasoningFrameDatam,
    //     egovlpActionFrameData: streamEgovlpActionFrameData,
    //     memoryFrameData: streamMemoryFrameData,
    //     boundingBoxFrameData: streamBoundingBoxFrameData,
    //     clipActionFrameData: streamClipActionFrameData,
    //     eyeFrameData: streamEyeFrameData,
    //     currentTime: streamCurrentTime
    // } = useStreamFrameData();
    // if(mode === "online"){
    //     return {
    //         reasoningFrameData: streamReasoningFrameDatam,
    //         egovlpActionFrameData: streamEgovlpActionFrameData,
    //         memoryFrameData: streamMemoryFrameData,
    //         boundingBoxFrameData: streamBoundingBoxFrameData,
    //         clipActionFrameData: streamClipActionFrameData,
    //         eyeFrameData: streamEyeFrameData,
    //         currentTime: streamCurrentTime
    //     }
    // }else{
        return {
            reasoningFrameData: recordingReasoningFrameData,
            egovlpActionFrameData: recordingEgovlpActionFrameData,
            clipActionFrameData: recordingClipActionFrameData,
            eyeFrameData: recordingEyeFrameData,
            memoryFrameData: recordingMemoryFrameData,
            boundingBoxFrameData: recordingBoundingBoxFrameData,
            currentTime: currentTime
        }
    // }
}

export {useRecordingData, useRecordingFrameData, useStreamFrameData, useFrameData};