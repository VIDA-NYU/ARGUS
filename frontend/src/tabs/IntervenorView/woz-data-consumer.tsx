import {useToken} from "../../api/TokenContext";
import {useGetAllRecordings, useGetRecipeInfo, useGetRecipes} from "../../api/rest";
import { useGetStreamInfo} from "./components/utils/rest";
import {parseVideoStateTime} from "./components/utils/video-time";
import WozCompContainer from "./woz-comp-container";
import {useVideoControl} from "./components/video/video-hook";
import {dataType} from '../../api/types'; //"../../../api/types";
import ReplayPlayer from "./components/video/replay-player";
import Controls from '../../utils/Controls';
import {useFrameData, useRecordingData} from "./components/utils/data-hook";
import {filterObjectWithRecipe, generateRecipeObjectIndex} from "./components/object-comps/utils";
import {AnnotationData} from "./components/annotation/types";
import {computeCurrentStep} from "./components/annotation/utils";
import {syncWithVideoTime} from "./components/video/utils/wrapper";


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
        <WozCompContainer
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
            boundingBoxFrameData={syncWithVideoTime(currentTime, state, annotationData.meta.entryTime, filterObjectWithRecipe(boundingBoxFrameData, generateRecipeObjectIndex(recipeData)))}
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