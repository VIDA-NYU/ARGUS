import {onProgressType} from "../../VideoDataView/VideoCard/VideoCard";
import React, {useRef} from "react";
import {format, formatTotalDuration} from "../../Helpers";
import screenful from "screenfull";
import {MediaState} from "../../HistoricalDataView";

export function useVideoControl (recordingData: any){
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

    return {
        state, playerRef, playerContainerRef, controlsRef, canvasRef,
        handleProgress, handleSeekingFromVideoCard, handlePlayPause,
        handleRewind, handleFastForward, handleDuration, handleDisplayFormat,
        timeDisplayFormat, setTimeDisplayFormat, elapsedTime,
        totalDurationValue, handlePlaybackRate, toggleFullScreen,
        handleSeekMouseDown, handleSeekMouseUp, handleSeekChange
    }
}