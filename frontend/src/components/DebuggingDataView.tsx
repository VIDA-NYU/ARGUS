import React, { useEffect } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';
import { StreamView } from './StreamDataView/LiveStream';
import { DeticHandsChart } from './StreamDataView/LiveCharts';
import { ImageView } from './StreamDataView/ImageView';
import { ClipOutputsView } from './StreamDataView/PerceptionOutputsView';
import { ReasoningOutputsView } from './StreamDataView/ReasoningOutputsView';
import { CLIP_ACTION_STEPS_STREAM, DETIC_HANDS_STREAM, DETIC_IMAGE_STREAM, EGOVLP_ACTION_STEPS_STREAM, MAIN_STREAM, REASONING_CHECK_STREAM } from '../config';

function DebuggingDataView() {
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
              "M M M M r r"
              "M M M M t t"
              "M M M M tt tt"
              "M M M M a a"
              "M M M M a a"
              "M M M M b b"
              "M M M M b b"
              "g g g g g g"
              "c c d d e e"
          `,
          xs: `
              "M M M M r r"
              "M M M M t t"
              "M M M M tt tt"
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
        <Box sx={{ gridArea: 'M' }}><ImageView streamId={MAIN_STREAM} boxStreamId={DETIC_IMAGE_STREAM} confidence={0.5} debugMode={true}/></Box>
        <Box sx={{ gridArea: 'a' }}>
          <StreamView utf streamId={EGOVLP_ACTION_STEPS_STREAM}>
            {data => (<Box pt={4}><ClipOutputsView data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'b' }}>
          <StreamView utf streamId={CLIP_ACTION_STEPS_STREAM}>
            {data => (<Box pt={4}><ClipOutputsView data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'g' }}>
        <StreamView utf streamId={DETIC_HANDS_STREAM} showStreamId={false} showTime={false}>
            {(data, time) => <DeticHandsChart data={{ ...JSON.parse(data), time }} />}
          </StreamView></Box>
        <Box sx={{ gridArea: 'c' }}><StreamView utf parse='prettyJSON' streamId={DETIC_IMAGE_STREAM} /></Box>
        <Box sx={{ gridArea: 'd' }}><StreamView utf parse='prettyJSON' streamId={DETIC_HANDS_STREAM} /></Box>
        {/* <Box sx={{ gridArea: 'e' }}><StreamView utf parse='prettyJSON' streamId={'reasoning'} /></Box> */}
        <Box sx={{ gridArea: 'r' }}>
          <StreamView utf streamId={REASONING_CHECK_STREAM} showStreamId={true} showTime={false}>
            {data => (<Box><ReasoningOutputsView data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
      </Box>
    </Box>
  )
}

export default DebuggingDataView;
