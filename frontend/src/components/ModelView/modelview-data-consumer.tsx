import {useToken} from "../../api/TokenContext";
import {useGetAllRecordings, useGetRecipeInfo, useGetRecipes, useGetStreamInfo} from "../../api/rest";
import {parseVideoStateTime} from "./components/utils/video-time";
import ModelViewCompContainer from "./modelview-comp-container";
import {useVideoControl} from "./components/video/video-hook";
import {dataType} from '../../api/types'; //"../../../api/types";
import ReplayPlayer from "./components/video/replay-player";
import Controls from '../../utils/Controls';
import {useFrameData, useRecordingData} from "./components/utils/data-hook";
import {filterObjectWithRecipe, generateRecipeObjectIndex} from "./components/object-comps/utils";
import {AnnotationData, AnnotationMeta} from "./components/annotation/types";
import {buildNewAnnotationMeta, computeCurrentStep} from "./components/annotation/utils";
import {syncWithVideoTime} from "./components/video/utils/wrapper";
import { useEffect, useState } from "react";
import { scaleLinear } from "d3";


interface RecipeData {
    _id: string,
    name: string,
    ingredients: string [],
    ingredients_simple: string [],
    instructions: string [],
    steps: string [],
    steps_simple: string [],
    tools: string [],
    tools_simple: string []
}


interface ModelViewDataConsumerProps {
    recordingName: string,
    annotationData: AnnotationData,
    playedTime: number,
    setAnnotationData: (newData: AnnotationData) => void
}

export default function ModelViewDataConsumer({recordingName, playedTime, annotationData, setAnnotationData}: ModelViewDataConsumerProps) {
    const [seekingPlayedTime, setSeekingPlayedTime] = useState<boolean>(false);

    // Update annotationData if the selected recording changes. 
    const setAnnotationMeta = (newMeta: AnnotationMeta) => {
        setAnnotationData({
            ...annotationData,
            meta: newMeta
        })
    }
    useEffect(() => {
        setAnnotationMeta(buildNewAnnotationMeta({
            ...annotationData.meta,
            id: recordingName
        }));
    }, [recordingName]);
    // end Update annotationData


    // Update model view component if the timestamp is updated through Point Cloud viewer by hovering the red dots (user head location) in the plot.
    useEffect(() => {
        if (playedTime && totalDuration !== "0:0") {
            let duration = parseFloat(totalDuration);
            let xScale = scaleLinear()
                .range([0, 1]) // return
                .domain([0, duration]);
            const played_time = xScale(playedTime < 0 ? 0 : playedTime);
            handleSeekChangePlayedTime(played_time);
            setSeekingPlayedTime(true);
        }
    }, [playedTime]);
    useEffect(() => {
        if(seekingPlayedTime) {
            setSeekingPlayedTime(false);
            handleSeekMouseUpPlayedTime();
        }
    }, [seekingPlayedTime]);


    const {token, fetchAuth} = useToken();

    const {response: recipeList} = useGetRecipes(token, fetchAuth);
    const recipeIDList = recipeList? recipeList.map(d => d._id) : [];
    const {response: recordingList} = useGetAllRecordings(token, fetchAuth);
    const {response: recipeData} = useGetRecipeInfo(token, fetchAuth, annotationData.meta.recipeID);

    // const [ recipeData, setRecipeData ] = useState<RecipeData>();
    const recordingID = annotationData.meta.id;

    const {response: streamInfo} = useGetStreamInfo(token, fetchAuth, "main");

    const {
        egovlpActionData, clipActionData, recordingData,
        reasoningData, boundingBoxData, memoryData, eyeData
    } = useRecordingData(recordingID, token, fetchAuth);

    const {
        state,
        controlsRef, playerContainerRef, playerRef, canvasRef,
        toggleFullScreen, totalDurationValue, timeDisplayFormat,
        elapsedTime,
        handleDuration, handleProgress, handleRewind,
        handleSeekMouseDown, handleSeekMouseUp, handleSeekChange, handleSeekChangePlayedTime,
        handlePlayPause, handleDisplayFormat, handleFastForward,
        handleSeekingFromVideoCard, handlePlaybackRate, handleSeekMouseUpPlayedTime
    } = useVideoControl(recordingData)

    const {
        playing,
        controls,
        light,
        loop,
        playbackRate,
        pip,
        played,
        seeking,
        totalDuration,
        currentTime: recordingCurrentPlayedTime,
    } = state;
    let recordingCurrentTime = Math.round(parseVideoStateTime(recordingCurrentPlayedTime) * 1000 + annotationData.meta.entryTime);
    // const {
    //     clipActionFrameData,
    //     eyeFrameData
    // } = useRecordingFrameData(
    //     currentTime, recordingData, reasoningData, memoryData,
    //     boundingBoxData, egovlpActionData, clipActionData, eyeData
    // )

    // const {
    //     reasoningFrameData, egovlpActionFrameData, memoryFrameData, boundingBoxFrameData
    // } = useStreamFrameData();

    const {reasoningFrameData, egovlpActionFrameData, clipActionFrameData, boundingBoxFrameData,
        memoryFrameData, eyeFrameData, currentTime} = useFrameData(
        annotationData.meta.mode, recordingCurrentTime, recordingData, reasoningData,
        memoryData, boundingBoxData, egovlpActionData, clipActionData, eyeData );

    console.log("reasoningData");
    console.log(reasoningData);
    console.log("-------reasoningFrameData");
    console.log(reasoningFrameData);
    console.log("clipActionData");
    console.log(clipActionData);
    
    const videoPlayer =
    (<ReplayPlayer
        type={dataType.VIDEO}
        data={recordingData}
        title={"Cameras"}
        state={state}
        recordingName={recordingID}
        onProgress={(res) => handleProgress(res)}
        onSeek={res => handleSeekingFromVideoCard(res)}
        boundingBoxData={boundingBoxFrameData}
        annotationData={annotationData}
        currentTime={currentTime}
    >
    </ReplayPlayer>);
    const videoControls = (
        <Controls
            ref={controlsRef}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            onDuration={handleDuration}
            onRewind={handleRewind}
            onPlayPause={handlePlayPause}
            onFastForward={handleFastForward}
            playing={playing}
            played={played}
            elapsedTime={elapsedTime}
            totalDuration={totalDurationValue}
            // onMute={hanldeMute}
            // muted={muted}
            // onVolumeChange={handleVolumeChange}
            // onVolumeSeekDown={handleVolumeSeekDown}
            onChangeDispayFormat={handleDisplayFormat}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRate}
            onToggleFullScreen={toggleFullScreen}
            // volume={volume}
            // onBookmark={addBookmark}
        />
    )

    const recipePicker = (
        <div/>
    )
    const currentStep = computeCurrentStep(annotationData, 0, currentTime);

    return (
        <ModelViewCompContainer
            state={state}
            currentTime={currentTime}
            currentStep={currentStep}
            recordingID={recordingID}
            recordingList={recordingList}
            recipeIDList={recipeIDList}
            recordingData={recordingData}
            streamInfo={streamInfo}
            recipeData={recipeData}
            reasoningData={reasoningData}
            reasoningFrameData={reasoningFrameData}
            boundingBoxData={boundingBoxData}
            boundingBoxFrameData={boundingBoxFrameData}
            // boundingBoxFrameData={syncWithVideoTime(currentTime, state, annotationData.meta.entryTime, filterObjectWithRecipe(boundingBoxFrameData, generateRecipeObjectIndex(recipeData)))}
            egovlpActionData={egovlpActionData}
            egovlpActionFrameData={egovlpActionFrameData}
            clipActionData={clipActionData}
            clipActionFrameData={clipActionFrameData}
            videoControls={videoControls}
            videoPlayer={videoPlayer}
            recipePicker={recipePicker}
        />
    )

}