import React, { useEffect } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';
import { useToken } from '../../api/TokenContext';
import { Login } from '../../tabs/RecipesCollectionView/RecipesView';
import { REASONING_CHECK_STREAM, CLIP_ACTION_STEPS_STREAM, DETIC_IMAGE_STREAM, MAIN_STREAM, TEST_PASS, TEST_USER } from '../../config';


import LoadingButton from '@mui/lab/LoadingButton';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useRecordingControls } from '../../api/rest';

import { StreamView } from './components/StreamDataView/LiveStream';
import { ImageView } from './components/StreamDataView/ImageView';
import { ClipOutputsLiveView } from './components/StreamDataView/PerceptionOutputsView';
import { ReasoningOutputsView } from './components/StreamDataView/ReasoningOutputsView';
import DebuggingDataView from '../DebuggingDataView/DebuggingDataView';


const RecordingControls = () => {
  const { recordingId, recordingData, recordingDataError, startError, stopError, finishedRecording, startRecording, stopRecording } = useRecordingControls();
  const formatRecording = (recordingData) => recordingData?.name && <>
    Recording name: {recordingData.name}<br/>
    Duration: {recordingData.duration} <br/>
    First Entry Time: {recordingData["first-entry-time"]} <br/>
    Last Entry Time: {recordingData["last-entry-time"]}
  </>;
  return (
      <Box sx={{ '& > button': { mt: "-20px", mb: 2, mr: 2 } }}>
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
  )
}
const parseTime = (tstr) => new Date(Date.parse(tstr + ' GMT')).toLocaleTimeString()

function LiveVideo() {
  return (
    <Box display='flex' justifyContent='center' alignItems='top' height='100%' width='100%'>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: 1,
          gridTemplateRows: 'auto',
          gridTemplateAreas: {
            lg: `
              "c c c c c c"
              "h M M M M r"
              "h M M M M r"
              "i M M M M a"
              "i M M M M a"
              "g M M M M a"
              "g M M M M a"
            `,
            md: `
              "c c c c c c"
              "h M M M M r"
              "h M M M M r"
              "i M M M M a"
              "i M M M M a"
              "g M M M M a"
              "g M M M M a"
            `,
            xs: `
              "c c c c c c"
              "h M M M M r"
              "h M M M M r"
              "i M M M M a"
              "i M M M M a"
              "g M M M M a"
              "g M M M M a"
            `
          },
        }}>
        <Box sx={{ gridArea: 'c', marginTop: 4 }}><RecordingControls /></Box>
        <DebuggingDataView />
      </Box>
    </Box>
  )
}

export default LiveVideo;