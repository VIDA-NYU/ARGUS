// react imports
import React, { useEffect, useRef, useState } from 'react';

// templates
import ComponentTemplate from '../../templates/HistoricalViewComponentTemplate/ComponentTemplate';

// material imports
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// types
import { MediaState, DeleteInfo } from './types/types';

// API imports
import { useGetAllRecordings, useGetRecording, useDeleteRecording, getPointCloudData, getEyeData, getIMUAccelData, getIMUGyroData, getIMUMagData, useGetAllRecordingInfo, useGetAllRecordingInfoNotoken  } from '../../api/rest';
import { useToken } from '../../api/TokenContext';
import { dataType, streamingType } from '../../api/types';

// global components
import Controls from '../../utils/Controls';

// local components
import PointCloudViewer from './components/PointCloudViewer/PointCloudViewer';
import IMUDataView from './components/IMUViewer/IMUViewer';

// helpers
import { formatTotalDuration, format  } from '../../utils/Helpers';

// video
import { onProgressType } from './components/VideoDataView/VideoCard/VideoCard';
import VideoDataView from './components/VideoDataView/VideoDataView';

// third-party
import screenful from 'screenfull';

// styles
import './styles/HistoricalDataView.css'
import * as d3 from 'd3'
import {getFilteredData, getHistogramValues, getMinMaxData} from './DataProcessing'

import c3 from "c3";
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import ListView from './ListView';
import Searchview, { myHorizontalBarChart } from './SearchView';

const Overview = () => {

    const [recordings, setRecordings] = React.useState([]);
    const [recordingID, setRecordingID] = React.useState<number>(0);
    const [recordingName, setRecordingName] = React.useState<string>('');
    const [recordingsAllInfo, setRecordingsAllInfo] = React.useState([]);
    // const [eyeData, setEyeData] = React.useState({});
    // const [handData, setHandData] = React.useState({});

    const [ imudata, setIMUData ] = React.useState([]);
    const [pointCloudData, setPointCloudData] = React.useState({});
    const [delData, setDelData] = React.useState<DeleteInfo>({name: "", confirmation: false});
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
    // const canvasRef = useRef(null);
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
    const {response: deletedRecord, status: statusDel} = useDeleteRecording(token, fetchAuth, delData);

    // fetch
    useEffect(() => {
      // Setup/initialize recording name.
      recordingsList && setRecordingName(recordingsList[0]);
      recordingsList && setRecordings(recordingsList);
    }, [recordingsList]);

    useEffect(() => {

        const fetchPointCloudData = async() => {
          try {
            console.log('Fetching...', recordingName);
            const pointCloudJSONFile = await getPointCloudData(recordingName);
            const gazePointClouJSONFile = await getEyeData(recordingName);
            setPointCloudData({ 'world': pointCloudJSONFile, 'gaze': gazePointClouJSONFile });
          } catch (error) {
            // console.log("error", error);
            setPointCloudData("404 Not Found. Point Cloud data was not found.");
          }
        };
  
        const fetchIMUData = async() => {
  
          try{
            const imuAccelJSONFile = await getIMUAccelData(recordingName);
            const imuGyroJSONFile = await getIMUGyroData(recordingName);
            const imuMagJSONFile = await getIMUMagData(recordingName);          
            setIMUData([ imuAccelJSONFile, imuGyroJSONFile, imuMagJSONFile ] );
          } catch( error ){
  
            console.log('Error retrieving IMU data');
            setIMUData([])
  
          }
  
        }
  
        if (recordingData && recordingData.streams){        
          Object.keys(recordingData.streams).includes(streamingType.POINTCLOUD) && 
          Object.keys(recordingData.streams).includes(streamingType.EYE) && 
          fetchPointCloudData();
  
          Object.keys(recordingData.streams).includes(streamingType.IMUACCEL) &&
          Object.keys(recordingData.streams).includes(streamingType.IMUGYRO) &&
          Object.keys(recordingData.streams).includes(streamingType.IMUMAG) &&
          fetchIMUData();
  
          // Object.keys(recordingData.streams).includes(streamingType.EYE) && fetchEyeData();
          // Object.keys(recordingData.streams).includes(streamingType.HAND) && fetchHandData();
        }
  
      }, [recordingData]);  
    

    const handleChangeRecording = (event: SelectChangeEvent) => {      
        const index = Number(event.target.value);
        setRecordingID(index);
        recordings && setRecordingName(recordings[index]);
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

    // const chart2 = myHorizontalBarChart(recordingsAllInfo, {
    //   yLabel: "Permit Categories",
    //   xLabel: "Duration of permit (hours)",
    //   totalHeight: 400, //height
    //   marginLeft: 160,
    //   color: "steelblue"
    // });

    const handleChange = (newValue) => {
        recordings && setRecordingName(newValue);
        setState({ ...state, totalDuration: "0:0" });
    }
    const handleChangeFilters = (updatedRecordingsAllInfo) => {
        setRecordingsAllInfo(updatedRecordingsAllInfo);
    }

    return (
        <div className='main-wrapper'>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3} style={{marginLeft:'-20px'}}>
                        <Card sx={{ maxWidth: '100%', height: 400, display: 'flex', flexDirection: 'column' }}>
                            Filters
                            <CardContent sx={{ flexGrow: 1, px: 2, py: 0.5, pt: 0.2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Searchview onChange={handleChangeFilters}/>
                            </Box>
                            </CardContent>
                        </Card>
                        <Card sx={{ maxWidth: '100%', height: 500, display: 'flex', flexDirection: 'column' , marginTop: 2}}>
                            <CardContent sx={{ flexGrow: 1, px: 2, py: 0.5, pt: 0.2, overflow: "auto" }}>
                            About {recordingsAllInfo && recordingsAllInfo.length} results:
                            <ListView  recordings={recordingsAllInfo} onChange={handleChange}/>
                        </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                    {/* <div className='main-wrapper'> */}
                        <div className='controls-wrapper'>
                            <Box>
                            <p> {recordingName}</p>
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
                                onChangeDispayFormat={handleDisplayFormat}
                                playbackRate={playbackRate}
                                onPlaybackRateChange={handlePlaybackRate}
                                onToggleFullScreen={toggleFullScreen}
                            />

                            </div>

                            <div className="layer-wrapper">
                            <ComponentTemplate title={'3D View'}>
                                    <PointCloudViewer
                                    pointCloudRawData={pointCloudData}
                                    videoState={state}
                                    recordingMetadata={recordingData}
                                    // worldPointCloudData={pointCloudData}
                                    // gazePointCloudData={eyeData}
                                    >
                                    </PointCloudViewer>
                                </ComponentTemplate>
                            </div>
                            
                        {/* </div> */}
                    </Grid>
                    <Grid item xs={3}>
                    <Card sx={{ maxWidth: '100%', height: 800, display: 'flex', flexDirection: 'column' }}>
                        Model Debugging
                        </Card>
                    </Grid>
                </Grid>
            </Box>

        </div>
    );
}

export default Overview;