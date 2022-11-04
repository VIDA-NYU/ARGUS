import {useToken} from "../../api/TokenContext";
import {useCurrentRecipe, useGetAllRecordings, useGetRecipeInfo, useGetRecipes, useGetRecording} from "../../api/rest";
import React, {useEffect, useRef, useState} from "react";
import {MediaState} from "../HistoricalDataView";
import {useGetRecordingJson, useGetStreamInfo} from "./utils/rest";
import {useVideoTime} from "./utils/video-time";
import {onProgressType} from "../VideoDataView/VideoCard/VideoCard";
import {format, formatTotalDuration} from "../Helpers";
import screenful from "screenfull";
import {useAnnotationContext} from "./annotation/provider";
import WozCompContainer from "./woz-comp-container";
import {useVideoControl} from "./video/video-hook";
import {dataType} from "../../api/types";
import ReplayPlayer from "./video/replay-player";
import Controls from "../Controls";
import {AnnotationData} from "./annotation/types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useFrameData, useRecordingData, useRecordingFrameData, useStreamFrameData} from "./utils/data-hook";
import eyesDataView from "../EyesDataView/EyesDataView";


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


interface WozDataConsumerProps {
    annotationData: AnnotationData,
    setAnnotationData: (newData: AnnotationData) => void
}

export default function WozDataConsumer({annotationData, setAnnotationData}: WozDataConsumerProps) {
    const {token, fetchAuth} = useToken();

    const {response: recipeList} = useGetRecipes(token, fetchAuth);
    const recipeIDList = recipeList? recipeList.map(d => d._id) : [];
    const {response: recordingList} = useGetAllRecordings(token, fetchAuth);
    const {response: recipeDataResponse} = useGetRecipeInfo(token, fetchAuth, "mugcake");

    const [ recipeData, setRecipeData ] = useState<RecipeData>();
    const recordingID = annotationData.meta.id;

    const {response: streamInfo} = useGetStreamInfo(token, fetchAuth, "main");

    const {
        egovlpActionData, clipActionData, recordingData,
        reasoningData, boundingBoxData, memoryData, eyeData
    } = useRecordingData(recordingID, token, fetchAuth);

    const RecipePicker = () => {
        const { token, fetchAuth } = useToken();
        const { response: recipes } = useGetRecipes(token, fetchAuth);
        const { response: recipe, setRecipe, setting } = useCurrentRecipe();
        const index = recipes && recipes.findIndex(item => item._id === recipe);
        if (recipes) { setRecipeData(recipes[index]);}

        return (
            <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
                <InputLabel id="recipe-selector-label">Select Recipe</InputLabel>
                {setting === true ? 'Setting...'  : <Select
                    labelId="recipe-selector-label"
                    id="recipe-selector"
                    value={recipe||''}
                    label="Select Recipe"
                    onChange={e => setRecipe(e.target.value)}
                >
                    {recipes && recipes.map(r => (
                        <MenuItem key={r.name} value={r._id}>{r.name}</MenuItem>
                    ))}
                    <MenuItem value={''}>--</MenuItem>
                </Select>}
            </FormControl>
        )
    }

    const {
        state,
        controlsRef, playerContainerRef, playerRef, canvasRef,
        toggleFullScreen, totalDurationValue, timeDisplayFormat,
        elapsedTime,
        handleDuration, handleProgress, handleRewind,
        handleSeekMouseDown, handleSeekMouseUp, handleSeekChange,
        handlePlayPause, handleDisplayFormat, handleFastForward,
        handleSeekingFromVideoCard, handlePlaybackRate
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
        currentTime: recordingCurrentTime,
    } = state;


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
    const {reasoningFrameData, egovlpActionFrameData, clipActionFrameData, boundingBoxFrameData, memoryFrameData, eyeFrameData, currentTime} = useFrameData(
        annotationData.meta.mode, recordingCurrentTime, recordingData,
        reasoningData, memoryData,
        boundingBoxData, egovlpActionData, clipActionData, eyeData );

    const videoPlayer = (<ReplayPlayer
        type={dataType.VIDEO}
        data={recordingData}
        title={"Cameras"}
        state={state}
        recordingName={recordingID}
        onProgress={(res) => handleProgress(res)}
        onSeek={res => handleSeekingFromVideoCard(res)}
        boundingBoxData={boundingBoxFrameData}
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
        <RecipePicker/>
    )

    return (
        <WozCompContainer
            state={state}
            currentTime={currentTime}
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