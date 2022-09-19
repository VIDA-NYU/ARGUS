import React, { useEffect } from 'react';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useToken } from '../api/TokenContext';
import { Login } from './RecipesView';
import { TEST_PASS, TEST_USER } from '../config';

import LoadingButton from '@mui/lab/LoadingButton';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { getLiveVideo, useGetCurrentRecordingInfo, useGetRecording, useStartRecording, useStopRecording, useRecordingControls } from '../api/rest';
import { RequestStatus, responseServer } from '../api/types';
import { LogsView, ImageView } from './LiveStream';
import {MemoryObjectView} from "./memory-view/memory-object-view";

let interval = null;


const RecordingControls = () => {
  const { recordingId, recordingData, recordingDataError, startError, stopError, finishedRecording, startRecording, stopRecording } = useRecordingControls();

  const formatRecording = (recordingData) => recordingData?.name && <>
    Recording name: {recordingData.name}<br/>
    Duration: {recordingData.duration} <br/>
    First Entry Time: {recordingData["first-entry-time"]} <br/>
    Last Entry Time: {recordingData["last-entry-time"]}
  </>;
  return (
    <Box>
      <Box sx={{ '& > button': { m: 1 } }}>
        <LoadingButton
          startIcon={<VideocamOutlinedIcon />}
          size="small"
          onClick={() => startRecording()}
          loading={!!recordingId}
          loadingIndicator="Recording…"
          variant="contained"
        >
          Start Recordings
        </LoadingButton>
        <Button
          startIcon={<StopCircleIcon />}
          size="small"
          color="primary"
          onClick={() => stopRecording()}
          variant="contained"
          disabled={!recordingId}
        >
          Stop Recording
        </Button>
      </Box>
      <Box style={{margin: 22}}>
        {startError && <Alert severity="error">We couldn't connect with the server. Please try again!<br/><pre>{startError}</pre></Alert>}
        {stopError && <Alert severity="error">Server Connection Issues: Please click again on the 'Stop Recording' button to finish your recording!<br/><pre>{stopError}</pre></Alert>}
        {recordingDataError && <Alert severity="error">Error retrieving recording data: {recordingDataError}</Alert>}
        {recordingData && <Alert severity="success">SUCCESSFUL server connection. The video is being recorded.<br/><br/>{formatRecording(recordingData)}</Alert>}
        {finishedRecording && <Alert severity="success">Your recording was saved.<br/><br/>{formatRecording(finishedRecording)}</Alert>}
      </Box>
    </Box>
  )
}

// the app - once you're authenticated
function LiveVideo() {
  return (
    <Box sx={{
        marginLeft: 30,
        marginRight: 30
    }}>
      {/* <RecordingControls />
      <Typography>
        Live View
      </Typography> */}
      <ImageView streamId='main' />
      <LogsView streamId={'clip:action:steps'} formatter={str => (<ClipOutputsView data={JSON.parse(str)} />)} />
      <LogsView streamId={'detic:image'} />
      <LogsView streamId={'reasoning'} />
        <MemoryObjectView streamId={"detic:memory"}></MemoryObjectView>
    </Box>
  )
}





interface ClipOutputsViewProps { data: { [key: string]: number; } }

const ClipOutputsView = ({ data }: ClipOutputsViewProps) => {
  return (<ul>
    {Object.entries(data).sort(([ta, sa], [tb,sb]) => ( sb-sa )).filter(x => x[1] > 0.1).map(([text, similarity]) => (
      <li key={text}><b>{text}</b>: {(similarity*100).toFixed(2)}</li>
    ))}
  </ul>)
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const MainVideo = () => {
  const { token } = useToken();
  return token ? <LiveVideo /> : <Login username={TEST_USER} password={TEST_PASS} />
  // <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
  //   <Paper>
  //     {token ? <LiveVideo /> : <Login username={TEST_USER} password={TEST_PASS} />}
  //   </Paper>
  // </Box>
}

export default MainVideo;
