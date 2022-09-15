import React, { useEffect } from 'react';
import colormap from 'colormap';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';
import { useToken } from '../api/TokenContext';
import { Login } from './RecipesView';
import { TEST_PASS, TEST_USER } from '../config';

import LoadingButton from '@mui/lab/LoadingButton';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useRecordingControls } from '../api/rest';
import { RequestStatus, responseServer } from '../api/types';
import { LogsView, StreamView, ImageView } from './LiveStream';

const RecordingControls = () => {
  const { recordingId, recordingData, recordingDataError, startError, stopError, finishedRecording, startRecording, stopRecording } = useRecordingControls();
  
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
        {startError && <Alert severity="error">We couldn't connect with the server. Please try again!<br/><pre>{startError}</pre></Alert>}
        {stopError && <Alert severity="error">Server Connection Issues: Please click again on the 'Stop Recording' button to finish your recording!<br/><pre>{stopError}</pre></Alert>}
        {recordingDataError && <Alert severity="error">Error retrieving recording data: {recordingDataError}</Alert>}
        {recordingData && <Alert severity="success">SUCCESSFUL server connection. The video is being recorded.<br/>{recordingData?.name && <>
          Recording: <b>{recordingData.name}</b> - &nbsp;
          <b>started:</b> {parseTime(recordingData["first-entry-time"])} &nbsp;
        </>}</Alert>}
        {finishedRecording && <Alert severity="success">Your recording was saved.<br/>{finishedRecording?.name && <>
          Recording: <b>{finishedRecording.name}</b> -  &nbsp;
          <b>started:</b> {parseTime(finishedRecording["first-entry-time"])} &nbsp;
          <b>ended:</b> {parseTime(finishedRecording["last-entry-time"])} &nbsp;
        </>}</Alert>}
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
              "M M M M a a"
              "M M M M a a"
              "M M M M b b"
              "M M M M b b"
              "c c d d e e"
          `,
          xs: `
              "H H H H H H"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "a a a b b b"
              "e e e e e e"
              "c c c d d d"
          `
          }
        }}>
        <Box sx={{ gridArea: 'H' }}><RecordingControls /></Box>
        <Box sx={{ gridArea: 'M' }}><ImageView streamId='main' boxStreamId='detic:image' confidence={0.5} /></Box>
        <Box sx={{ gridArea: 'a' }}>
          <StreamView utf streamId={'egovlp:action:steps'}>
            {data => (<Box pt={4}><ClipOutputsView data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'b' }}>
          <StreamView utf streamId={'clip:action:steps'}>
            {data => (<Box pt={4}><ClipOutputsView data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'c' }}><StreamView utf parse='prettyJSON' streamId={'detic:image'} /></Box>
        <Box sx={{ gridArea: 'd' }}><StreamView utf parse='prettyJSON' streamId={'detic:hands'} /></Box>
        <Box sx={{ gridArea: 'e' }}><StreamView utf parse='prettyJSON' streamId={'reasoning'} /></Box>
      </Box>
    </Box>
  )
}


let probColors = colormap({
  colormap: 'winter',
  nshades: 10,
  format: 'rgbaString',
  alpha: [0, 1],
})
console.log(probColors)

interface ClipOutputsViewProps { data: { [key: string]: number; } }

const ClipOutputsView = ({ data }: ClipOutputsViewProps) => {
  return data && (<Box display='flex' flexDirection='column'>
    {Object.entries(data)
           .sort(([ta, sa], [tb,sb]) => ( sb-sa ))
           .slice(0, 5)
           .map(([text, similarity]) => (
            <Chip key={text} label={`${text}: ${(similarity*100).toFixed(2)}`} sx={{ 
              backgroundColor: probColors[Math.round(Math.max(1, similarity*(probColors.length-1)))],
              // opacity: Math.max(0.7, similarity),
            }} />
    ))}
  </Box>)
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const MainVideo = () => {
  const { token } = useToken();
  return token ? <LiveVideo /> : <Login username={TEST_USER} password={TEST_PASS} />
}

export default LiveVideo;
