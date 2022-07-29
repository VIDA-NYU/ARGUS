import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { onProgressType } from './VideoCard';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TokenProvider, useToken } from '../api/TokenContext';
import { getAudioPath, getEyeData, getHandData, getVideoPath, useGetAllRecordings, useGetRecording } from '../api/rest';
import { dataType, streamingType } from '../api/types';
import Controls from './Controls';
import screenful from "screenfull";
import { format, formatTotalDuration } from './Helpers';
import AccordionView from './AccordionView';

export interface MediaState {
  pip?: boolean;
  playing: boolean;
  controls?: boolean;
  light?: boolean;
  played: number;
  duration?: number;
  playbackRate: number;
  loop?: boolean;
  seeking: boolean;
  totalDuration?: string;
  currentTime?: string;
}
function RecordingsDataView() {
    const [recordingID, setRecordingID] = React.useState<number>(0);
    const [recordingName, setRecordingName] = React.useState<string>('');
    const [eyeData, setEyeData] = React.useState({});
    const [handData, setHandData] = React.useState({});

    const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
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

    // get the token and authenticated fetch function
    const { token, fetchAuth } = useToken();

    // query the streamings endpoint (only if we have a token)
    // fetch list of available recordings 
    const {response: recordingsList} = useGetAllRecordings(token, fetchAuth);
    // fetch data available of an specific recording
    const {response: recordingData} = useGetRecording(token, fetchAuth, recordingName);

    useEffect(() => {
      // Setup/initialize recording name.
      recordingsList && setRecordingName(recordingsList[0]);
    }, [recordingsList]);


    useEffect(() => {
      const fetchEyeData = async () => {
        try {
          const jsonFile = await getEyeData(recordingName);
          setEyeData(jsonFile.slice(0, 20));
        } catch (error) {
                // console.log("error", error);
                setEyeData("404 Not Found. Eye data was not found.");
              }
      };
      const fetchHandData = async () => {
        try {
          const jsonFile = await getHandData(recordingName);
          setHandData(jsonFile.slice(0, 20));
        } catch (error) {
          // console.log("error", error);
          setHandData("404 Not Found. Hand data was not found.");
        }
      };

      if (recordingData && recordingData.streams){
        Object.keys(recordingData.streams).includes(streamingType.EYE) && fetchEyeData();
        Object.keys(recordingData.streams).includes(streamingType.HAND) && fetchHandData();
      }

    }, [recordingData]);

    const handleChangeRecording = (event: SelectChangeEvent) => {
      const index = Number(event.target.value);
      setRecordingID(index);
      recordingsList && setRecordingName(recordingsList[index]);
      setState({ ...state, totalDuration: "0:0" });
    };

    const handleSeekMouseDown = (e) => {
      // console.log({ value: e.target });
      setState({ ...state, seeking: true });
    };
    const handleSeekChange = (e) => {
      // console.log("handleSeekChange", e.target.value);
      const temporal = parseFloat(e.target.value); // parseFloat(e.target.value) / 100;
      setState({ ...state, played: temporal });
    };
    const handleSeekMouseUp = (e) => {
      // console.log("handleSeekMouseUp", { value: e.target });
      setState({ ...state, seeking: false });
    };

    const handleProgress  = (changeState: onProgressType) => {
      const newDuration = changeState.totalDuration;
      // We only want to update time slider if we are not currently seeking
      if (!state.seeking) {
        setState({ ...state, ...changeState, totalDuration: newDuration > totalDuration ? totalDuration : newDuration  });
      }
    }

    const handleSeekingFromVideoCard  = (value) => {
      //TODO: being able to control all the videos from a child video
    }

    const handlePlayPause = () => {
      setState({ ...state, playing: !state.playing });
    };

    const handleRewind = () => {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    };

    const handleFastForward = () => {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    };

    const handleDuration = (duration) => {
      setState({ ...state, duration });
    };

    const handleDisplayFormat = () => {
      setTimeDisplayFormat(
        timeDisplayFormat == "normal" ? "remaining" : "normal"
      );
    };

    const handlePlaybackRate = (rate) => {
      setState({ ...state, playbackRate: rate });
    };

    const toggleFullScreen = () => {
      screenful.toggle(playerContainerRef.current);
    };

    const elapsedTime =
      timeDisplayFormat == "normal"
        ? format(currentTime) : "0:0";
        // : `-${format(totalDuration - currentTime)}`;

    // const totalDurationValue = format(totalDuration);
    const totalDurationValue = (recordingData && recordingData.duration) ? formatTotalDuration(recordingData.duration) : "0:0";

  const renderStreamings= () => {
    if (recordingData !== undefined && recordingData &&  recordingData.streams){
      return <>
        <AccordionView type={dataType.VIDEO} data={recordingData} title={"Cameras"} state={state} recordingName={recordingName} onProgress={(res) => handleProgress(res)} onSeek={res => handleSeekingFromVideoCard(res)}
        ></AccordionView>
        {
          Object.keys(recordingData.streams).includes(streamingType.MIC) &&
          <AccordionView type={dataType.AUDIO} data={recordingData} title={"Audio Data"} state={state} recordingName={recordingName} onProgress={(res) => handleProgress(res)} onSeek={res => handleSeekingFromVideoCard(res)}
        ></AccordionView>
        }
        {
          Object.keys(recordingData.streams).includes(streamingType.EYE) &&
          <AccordionView type={dataType.JSON} data={eyeData} title={"Eye Data"} ></AccordionView>
        }
        {
          Object.keys(recordingData.streams).includes(streamingType.HAND) &&
        <AccordionView type={dataType.JSON} data={handData} title={"Hand Data"} ></AccordionView>
        }
        </>
    }
    return <></>;
  }


  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
          <InputLabel id="demo-simple-select-label">Select Data </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={recordingID.toString()}
            label="Select Data"
            onChange={handleChangeRecording}
          >
          {
            recordingsList && Array.from(Array(recordingsList.length)).map((_, index) => (
                <MenuItem key={'menu-item-' + index} value={index}>{recordingsList[index]}</MenuItem>
            ))
          }
          </Select>
        </FormControl>
      </Box>   

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
      {renderStreamings()}
    </div>
  );
}

// top level - wraps with a global token context
const HistoricalDataView = () => {
  return <TokenProvider>
    <RecordingsDataView />
  </TokenProvider>
}

export default HistoricalDataView;