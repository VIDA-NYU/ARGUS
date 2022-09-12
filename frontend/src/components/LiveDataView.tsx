import React, { useEffect } from 'react';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useToken } from '../api/TokenContext';
import { Login } from './RecipesView';
import { TEST_PASS, TEST_USER } from '../config';

import LoadingButton from '@mui/lab/LoadingButton';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { getLiveVideo, useGetCurrentRecordingInfo, useGetRecording, useStartRecording, useStopRecording } from '../api/rest';
import { RequestStatus, responseServer } from '../api/types';

let interval = null;

// the app - once you're authenticated
function LiveVideo() {

  const [recording, setRecording] = React.useState(false);
  const [count, setCurrentRecordInfo] = React.useState<number>(0);
  const [startStatus, setStartStatus] = React.useState<RequestStatus | undefined>(undefined);
  const [stopStatus, setStopStatus] = React.useState<RequestStatus | undefined>(undefined);
  const [startData, setStartData] = React.useState<responseServer>({response: undefined, error: undefined, status: undefined});
  const [stopData, setStopData] = React.useState<responseServer>({response: undefined, error: undefined, status: undefined});


  
  // get the token and authenticated fetch function
  const { token, fetchAuth } = useToken();
  const { response: respStartData, error: respStartError, status: respStartStatus } = useStartRecording(token, fetchAuth, startStatus);
  const { response: respStopData, error: respStopError, status: respStopStatus  } = useStopRecording(token, fetchAuth, stopStatus);
  const {response: recordingData} = useGetRecording(token, fetchAuth, startData.response);

  useEffect(() => { 
    if(recording && startStatus !== RequestStatus.IN_PROGRESS && stopStatus !== RequestStatus.ERROR){
      setStartStatus(RequestStatus.STARTED)
      setStopStatus(undefined);
    }
    if(!recording && startStatus === RequestStatus.IN_PROGRESS){
      setStopStatus(RequestStatus.STARTED);
    }
  }, [recording])

  useEffect(() => {
    if (respStartStatus === RequestStatus.SUCCESS) {

      if(respStartData === undefined){ //Something get wrong! Try to start again!
        setRecording(false);
        setStartStatus(RequestStatus.ERROR);
      } else {
        setStartStatus(RequestStatus.IN_PROGRESS);
        interval = null;
        let count_ = 0;
        interval = setInterval(function() {
          count_++
          setCurrentRecordInfo(count_++);
        }, 5000);
      }
      setStartData({response: respStartData, error: respStartError, status: respStartStatus});
    }
  }, [respStartStatus, respStartData])

  useEffect(() => {
    if (respStopStatus === RequestStatus.SUCCESS) {
      if(respStopData === 0 || respStopData === undefined){ //Something get wrong! respStopData should be 1 if it was successful! Try to stop again!
        setStopStatus(RequestStatus.ERROR);
        setRecording(true);
      } else {
        setStartStatus(undefined);
        setStopStatus(RequestStatus.IN_PROGRESS);
        clearInterval(interval);
      }
      setStopData({response: respStopData, error: respStopError, status: respStopStatus});
    }
  }, [respStopStatus, respStopData])

  function handleStartLoadingClick(value) {
    setRecording(value);
  }

  useEffect(() => {
    console.log("Refresh Page (total): ", count)
  }, [count])

  const currentRecordingInfo = recordingData && recordingData.name !== "undefined" && recordingData.name === startData.response &&
    <>
    Recording name: {startData.response}<br/>
    Duration: {recordingData.duration} <br/>
    First Entry Time: {recordingData["first-entry-time"]} <br/>
    Last Entry Time{recordingData["last-entry-time"]}
    </>;

  return (
    <div className="mt-2 mr-2 ml-2">
      {!recording && <Alert severity="info">Before starting a new recording, please refresh the page!</Alert>}
      <Box sx={{ '& > button': { m: 1 } }}>
        <LoadingButton
          startIcon={<VideocamOutlinedIcon />}
          size="small"
          onClick={() => handleStartLoadingClick(true)}
          loading={recording}
          loadingIndicator="Recording…"
          variant="contained"
        >
          Start Recordings
        </LoadingButton>
        <Button
          startIcon={<StopCircleIcon />}
          size="small"
          color="primary"
          onClick={() => handleStartLoadingClick(false)}
          variant="contained"
          disabled={!recording}
        >
          Stop Recording
        </Button>
      </Box>
      <Box style={{margin: 22}}>
        {
        (startStatus === undefined && startStatus !== RequestStatus.ERROR) || stopStatus === RequestStatus.IN_PROGRESS?
        <></> :
        startStatus === RequestStatus.STARTED ?
        <Alert severity="info">Connecting to server ... </Alert> :
        startStatus === RequestStatus.IN_PROGRESS && startData.response !== undefined ?
        <Alert severity="success">SUCCESSFUL server connection. The video is being recorded.<br/><br/>
        {currentRecordingInfo}
        </Alert> :
        <Alert severity="error">We couldn't connect with the server. Please try again!</Alert>
        }
        {
        stopStatus === RequestStatus.ERROR && <Alert severity="error">Server Connection Issues: Please click again on the 'Stop Recording' button to finish your recording!</Alert>
        }
        {
        stopStatus === RequestStatus.IN_PROGRESS && <Alert severity="success">Your recording was saved.<br/><br/>
        {currentRecordingInfo}
        </Alert>
        }
      </Box>
      <div style={{margin: 22}}
      >
        <div><span style={{fontWeight: "bold"}}>Live View</span></div>
        <></>
         <img alt='live' src={getLiveVideo()} />
        {/* <img alt='live' src={`${API_URL}/mjpeg/main?last_entry_id=0`} /> */}
        {/* <VideoCard title="Live Data" subtitle={""} path={"http://localhost:4000/video"}/> */}
      </div>
    </div>
  )
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const MainVideo = () => {
  const { token } = useToken();
  return <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
    <Paper>
      {token ? <LiveVideo /> : <Login username={TEST_USER} password={TEST_PASS} />}
    </Paper>
  </Box>
}

export default MainVideo;
