import React, { useEffect } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { TokenProvider, useToken } from '../api/TokenContext';
import { Login } from './RecipesView';
import { TEST_PASS, TEST_USER } from '../config';

import LoadingButton from '@mui/lab/LoadingButton';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { getLiveVideo, useStartRecording, useStopRecording } from '../api/rest';


// the app - once you're authenticated
function LiveVideo() {

  const [recording, setRecording] = React.useState(false);
  const [recordingName, setName] = React.useState('');
  
  // get the token and authenticated fetch function
  const { token, fetchAuth } = useToken();
  const { response: startData } = useStartRecording(token, fetchAuth, recording, recordingName);
  const { response: stopData } = useStopRecording(token, fetchAuth, recording, recordingName);

  useEffect(() => { 
    if(recording){
      setName('start-recording');
    }
    if(!recording && recordingName !== ''){
      setName('');
    }
  }, [recording])

  function handleStartLoadingClick(value) {
    setRecording(value);
  }

  return (
    <div className="mt-2 mr-2 ml-2">
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

// top level - wraps with a global token context
const LiveDataView = () => {
  return <TokenProvider>
    <MainVideo />
  </TokenProvider>
}

export default LiveDataView;
