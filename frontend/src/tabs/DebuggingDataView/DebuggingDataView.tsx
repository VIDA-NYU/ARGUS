import { Box } from '@mui/material';
import { StreamView } from '../LiveDataView/components/StreamDataView/LiveStream';
import { DeticHandsChart } from '../LiveDataView/components/StreamDataView/LiveCharts';
import { ImageView } from '../LiveDataView/components/StreamDataView/ImageView';
import { ClipOutputsView } from '../LiveDataView/components/StreamDataView/PerceptionOutputsView';
import { ReasoningOutputsView } from '../LiveDataView/components/StreamDataView/ReasoningOutputsView';
import { DETIC_HANDS_STREAM, DETIC_IMAGE_STREAM, EGOVLP_ACTION_STEPS_STREAM, MAIN_STREAM, REASONING_CHECK_STREAM } from '../../config';

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
              "M M M M e e"
              "M M M M a a"
              "c c d d a a"
              "c c g g a a"
          `,
          xs: `
              "M M M M r r"
              "M M M M e e"
              "M M M M e e"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "a a a b b b"
              "e e e e e e"
              "c c c d d d"
          `
          },
        }}>
        <Box sx={{ gridArea: 'M' }}><ImageView streamId={MAIN_STREAM} boxStreamId={DETIC_IMAGE_STREAM} confidence={0.5} debugMode={true}/></Box>
        <Box sx={{ gridArea: 'r' }}>
          <StreamView utf streamId={REASONING_CHECK_STREAM} showStreamId={true} showTime={false}>
            {data => (<Box><ReasoningOutputsView data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'a' }}>
          <StreamView utf streamId={EGOVLP_ACTION_STEPS_STREAM}>
            {data => (<Box pt={4}><ClipOutputsView data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'c' }}><StreamView utf parse='prettyJSON' streamId={DETIC_IMAGE_STREAM} /></Box>
        <Box sx={{ gridArea: 'd' }}><StreamView utf parse='prettyJSON' streamId={DETIC_HANDS_STREAM} /></Box>
        <Box sx={{ gridArea: 'g' }}>
        <StreamView utf streamId={DETIC_HANDS_STREAM} showStreamId={false} showTime={false}>
            {(data, time) => <DeticHandsChart data={{ ...JSON.parse(data), time }} />}
          </StreamView></Box>
        {/* <Box sx={{ gridArea: 'e' }}><StreamView utf parse='prettyJSON' streamId={'reasoning'} /></Box> */}
        
      </Box>
    </Box>
  )
}

export default DebuggingDataView;
