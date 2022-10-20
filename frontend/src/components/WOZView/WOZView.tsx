import React, {useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, Paper, Typography, Chip} from '@mui/material';
import {useToken} from '../../api/TokenContext';
import {Login} from '../RecipesView';
import {DETIC_IMAGE_STREAM, MAIN_STREAM, REASONING_CHECK_STREAM, TEST_PASS, TEST_USER} from '../../config';
import {useGetRecipeInfo, useGetRecording, useCurrentRecipe, useGetRecipes} from '../../api/rest';
import {StreamView} from '../StreamDataView/LiveStream';
import {ImageView} from '../StreamDataView/ImageView';
import {ReasoningOutputsView, ReasoningOutputsWOZView} from '../StreamDataView/ReasoningOutputsView';
import {MediaState} from "../HistoricalDataView";
import {dataType} from "../../api/types";
import VideoDataView from "../VideoDataView/VideoDataView";
import ReplayPlayer from "./video/replay-player";
import {onProgressType} from "../VideoDataView/VideoCard/VideoCard";
import Controls from "../Controls";
import screenful from "screenfull";
import {format, formatTotalDuration} from "../Helpers";
import {ClipOutputsView} from "../StreamDataView/PerceptionOutputsView";
import {useVideoTime} from "./utils/video-time";
import {getActionData, useGetRecordingJson} from "./utils/rest";
import {MemoryReplayView} from "../memory-view/memory-replay-view";
import TemporalOverview from "./overview/temporal-overview";
import Card from "@mui/material/Card";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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



function WOZView() {

  const [ recipeData, setRecipeData ] = useState<RecipeData>();


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

    const {token, fetchAuth} = useToken();
    // const {response: recipeData} = useGetRecipeInfo(token, fetchAuth, "mugcake");

    const [recordings, setRecordings] = React.useState([]);
    const [recordingID, setRecordingID] = React.useState<string>("ethan_mugcake_0");
    const [mode, setMode] = React.useState<string>("replay")
    const [state, setState] = React.useState<MediaState>({
        pip: false,
        playing: false,
        controls: false,
        light: false,

        played: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        seeking: false,
        totalDuration: "0:0",
        currentTime: "0:0",
    });
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsRef = useRef(null);
    const canvasRef = useRef(null);
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
        currentTime,
    } = state;
    const {response: recordingData} = useGetRecording(token, fetchAuth, recordingID);

    useEffect(() => {
    }, [])

    const {data: actionData} = useGetRecordingJson(recordingID, "egovlp:action:steps");
    const {frameIndex: actionFrameIndex, frameData: actionFrameData} = useVideoTime(currentTime, actionData, recordingData)

    let egovlpActionFrameData = actionFrameData;

    const {data: clipActionData} = useGetRecordingJson(recordingID, "clip:action:steps");
    const {frameIndex: clipActionFrameIndex, frameData: clipActionFrameData} = useVideoTime(currentTime, clipActionData, recordingData)

    const {data: memoryData} = useGetRecordingJson(recordingID, "detic:memory");
    const {frameIndex: memoryFrameIndex, frameData: memoryFrameData} = useVideoTime(currentTime, memoryData, recordingData);

    const {data: eyeData} = useGetRecordingJson(recordingID, "eye");
    const {frameIndex: eyeFrameIndex, frameData: eyeFrameData} = useVideoTime(currentTime, eyeData, recordingData);

    const {data: reasoningData} = useGetRecordingJson(recordingID, "reasoning");
    const {frameIndex: reasoningFrameIndex, frameData: reasoningFrameData} = useVideoTime(currentTime, reasoningData, recordingData);

    const {data: boundingBoxData} = useGetRecordingJson(recordingID, "detic:world");
    const {frameIndex: boundingBoxFrameIndex, frameData: boundingBoxFrameData} = useVideoTime(currentTime, boundingBoxData, recordingData);


    const handleProgress = (changeState: onProgressType) => {

        const newDuration = changeState.totalDuration;
        // We only want to update time slider if we are not currently seeking
        if (!state.seeking) {
            setState({
                ...state, ...changeState,
                totalDuration: newDuration > totalDuration ? totalDuration : newDuration
            });
        }
    }
    const handleSeekingFromVideoCard = (value) => {
        //TODO: being able to control all the videos from a child video
    }

    const handlePlayPause = () => {
        setState({...state, playing: !state.playing});
    };

    const handleRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    };

    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    };

    const handleDuration = (duration) => {
        setState({...state, duration});
    };

    const handleDisplayFormat = () => {
        // setTimeDisplayFormat(
        //     timeDisplayFormat == "normal" ? "remaining" : "normal"
        // );
    };
    const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");


    const elapsedTime =
        timeDisplayFormat == "normal"
            ? format(currentTime) : "0:0";
    // : `-${format(totalDuration - currentTime)}`;

    // const totalDurationValue = format(totalDuration);
    const totalDurationValue = (recordingData && recordingData.duration) ? formatTotalDuration(recordingData.duration) : "0:0";


    const handlePlaybackRate = (rate) => {
        setState({...state, playbackRate: rate});
    };

    const toggleFullScreen = () => {
        screenful.toggle(playerContainerRef.current);
    };


    const handleSeekMouseDown = (e) => {
        // console.log({ value: e.target });
        setState({...state, seeking: true});
    };
    const handleSeekChange = (e) => {
        // console.log("handleSeekChange", e.target.value);
        const temporal = parseFloat(e.target.value); // parseFloat(e.target.value) / 100;
        setState({...state, played: temporal});
    };
    const handleSeekMouseUp = (e) => {
        // console.log("handleSeekMouseUp", { value: e.target });
        setState({...state, seeking: false});
    };


    return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: 1,
          gridTemplateRows: 'auto',
          gridTemplateAreas: {
            md: `
              "H H H H H H"
              "H H H H H H"
              "M M M r r r"
              "M M M r r r"
              "N N N r r r"
              "g g g g c c"
              "g g g g c c"
              "g g g g c c"
          `,
          xs: `
              "H H H H H H"
              "H H H H H H"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "g g g g g g"
              "a a a b b b"
              "e e e e e e"
              "c c c d d d"
          `
          },
        }}>
        <Box sx={{ gridArea: 'H' }}>
          <Box sx={{ '& > button': { mt: 2, mb: 2, mr: 2 } }}>
            <RecipePicker />
          </Box>
        </Box>
        <Box sx={{ gridArea: 'r' }}>
          <StreamView utf streamId={REASONING_CHECK_STREAM} showStreamId={false} showTime={false}>
            {data => (<Box><ReasoningOutputsWOZView
                clipActionFrameData={clipActionFrameData}
                egovlpActionFrameData={egovlpActionFrameData}
                reasoningFrameData={reasoningFrameData}
                worldFrameData={boundingBoxFrameData}
                recipe={recipeData} data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'c' }}>
          <Box  pt={2} mr={2} ml={2} >
          <span><b>INGREDIENTS</b></span>
          <>{
            recipeData && recipeData.ingredients.map((value: string, index: number ) => {
              return <li key={'ing_'+ index} > {value} </li>
              })
            }
          </>
          </Box>
        </Box>
                {/*<Box sx={{gridArea: 'H'}}>*/}
                {/*    <Box sx={{'& > button': {mt: 2, mb: 2, mr: 2}}}>*/}
                {/*        <b>RECIPE: {recipeData && recipeData.name}</b>*/}
                {/*    </Box>*/}
                {/*</Box>*/}

                {/*<Box sx={{gridArea: 'b'}}>*/}
                {/*    <Box pt={2} mr={2} ml={2}>*/}
                {/*        <span><b>INGREDIENTS</b></span>*/}
                {/*        <>{*/}
                {/*            recipeData && recipeData.ingredients.map((value: string, index: number) => {*/}
                {/*                return <li key={'ing_' + index}> {value} </li>*/}
                {/*            })*/}
                {/*        }*/}
                {/*        </>*/}
                {/*    </Box>*/}
                {/*</Box>*/}
                <Box sx={{gridArea: 'M'}}>
                    {recordingData && <ReplayPlayer
                        type={dataType.VIDEO}
                        data={recordingData}
                        title={"Cameras"}
                        state={state}
                        recordingName={recordingID}
                        onProgress={(res) => handleProgress(res)}
                        onSeek={res => handleSeekingFromVideoCard(res)}
                        boundingBoxData={boundingBoxFrameData}
                    >
                    </ReplayPlayer>}
                    {/*<ImageView streamId='replay:detic:image' boxStreamId='debug' confidence={0.5} debugMode={false}/>*/}
                </Box>
                <Box
                    sx={{gridArea: "N"}}
                >
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
                </Box>

                {/*<Box sx={{gridArea: 'c'}}>*/}
                {/*            <Card>*/}
                {/*                <MemoryReplayView memoryFrameData={memoryFrameData} eyeFrameData={eyeFrameData}/>*/}
                {/*            </Card>*/}
                {/*</Box>*/}
                <Box sx={{ gridArea: 'g' }}>
                    {
                        recordingData && boundingBoxData && reasoningData && clipActionData && <TemporalOverview
                            state={state}
                            clipActionData={clipActionData}
                            reasoningData={reasoningData}
                            boundingBoxData={boundingBoxData}
                            recordingMeta={recordingData}
                        ></TemporalOverview>
                    }
                </Box>
            </Box>
        </Box>
    )
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const MainVideo = () => {
    const {token} = useToken();
    return token ? <WOZView/> : <Login username={TEST_USER} password={TEST_PASS}/>
}

export default WOZView;
