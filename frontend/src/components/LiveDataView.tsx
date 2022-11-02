import React, { useEffect } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';
import { useToken } from '../api/TokenContext';
import { Login } from './RecipesView';
import { REASONING_CHECK_STREAM, CLIP_ACTION_STEPS_STREAM, DETIC_IMAGE_STREAM, MAIN_STREAM, TEST_PASS, TEST_USER } from '../config';


import LoadingButton from '@mui/lab/LoadingButton';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useRecordingControls } from '../api/rest';

import { StreamView } from './StreamDataView/LiveStream';
import { ImageView } from './StreamDataView/ImageView';
import { ClipOutputsLiveView } from './StreamDataView/PerceptionOutputsView';
import { ReasoningOutputsView } from './StreamDataView/ReasoningOutputsView';


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
      <Box sx={{ '& > button': { mt: 2, mb: 2, mr: 2 } }}>
        <LoadingButton
          startIcon={<VideocamOutlinedIcon />}
          size="medium"
          onClick={() => startRecording()}
          loading={!!recordingId}
          loadingIndicator="Recording…"
          variant="contained"
        >
          Start Recordings
        </LoadingButton>
        <Button
          startIcon={<StopCircleIcon />}
          size="medium"
          color="primary"
          onClick={() => stopRecording()}
          variant="contained"
          disabled={!recordingId}
        >
          Stop Recording
        </Button>
        <Box style={{margin: 22}}>
          {startError && <Alert severity="error">We couldn't connect with the server. Please try again!<br/><pre>{startError.response.data}</pre></Alert>}
          {stopError && <Alert severity="error">Server Connection Issues: Please click again on the 'Stop Recording' button to finish your recording!<br/><pre>{stopError.response.data}</pre></Alert>}
          {recordingDataError && <Alert severity="error">Error retrieving recording data: {recordingDataError}</Alert>}
          {recordingData && <Alert severity="success">SUCCESSFUL server connection. The video is being recorded.<br/><br/>{formatRecording(recordingData)}</Alert>}
          {finishedRecording && <Alert severity="success">Your recording was saved.<br/><br/>{formatRecording(finishedRecording)}</Alert>}
        </Box>
      </Box>
    </Box>  
  )
}
const parseTime = (tstr) => new Date(Date.parse(tstr + ' GMT')).toLocaleTimeString()

function LiveVideo() {
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
              "M M M M r r"
              "M M M M r r"
              "M M M M b b"
              "M M M M b b"
              "g g g g g g"
              "c c d d e e"
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
        <Box sx={{ gridArea: 'H' }}><RecordingControls /></Box>
        <Box sx={{ gridArea: 'M' }}><ImageView streamId={MAIN_STREAM} boxStreamId={DETIC_IMAGE_STREAM} confidence={0.5} debugMode={false}/></Box>
      </Box>
    </Box>
  )
}

export default LiveVideo;