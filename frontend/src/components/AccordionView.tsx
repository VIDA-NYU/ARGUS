import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { onProgressType, VideoCard } from './VideoCard';
import JSONPretty from 'react-json-pretty';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AudioCard } from './AudioCard';
import { getAudioPath, getVideoPath} from '../api/rest';
import { dataType, streamingType } from '../api/types';
import { MediaState } from './HistoricalDataView';

interface Data {
  id: number,
  name: string,
  files: string [],
  totalCameras: number
}

interface AccordionProps {
  type: string,
  title: string,
  data: any | Data [],
  recordingName?: string,
  state?: MediaState,
  onProgress?: (changeStatus: onProgressType) => void;
  onSeek?: (value: number) => void;
}

const AccordionView = ({ type, title, data, recordingName, state, onProgress, onSeek }: AccordionProps) => {
  const videoStreamings = { [streamingType.VIDEO_MAIN]: 'Main',
                     [streamingType.VIDEO_DEPTH]: 'Depth',
                     [streamingType.VIDEO_GLL]: 'Grey Left-Left',
                     [streamingType.VIDVIDEO_GLF]: 'Grey Left-Front',
                     [streamingType.VIDEO_GRF]: 'Grey Right-Front',
                     [streamingType.VIDEO_GRR]: 'Grey Right-Right'
  };
  const videoStreamingsIDs = Object.keys(videoStreamings);
  return (
    <Accordion defaultExpanded={true} >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
      {
        type === dataType.JSON &&
        <Box style={{maxHeight: 400, overflow: 'auto'}}
            sx={{
              backgroundColor: '#f9f9f9',
              '&:hover': {
                backgroundColor: '#E5E5E5',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>
            {JSON.stringify(data)}
          </Box>
      }
      {
        type === dataType.VIDEO && 
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 1, md: 2 }} >
              {
              videoStreamingsIDs.map((name, index) => {
                const streams = Object.keys(data.streams);
                if (streams.includes(name)){ //verify if stream exists.
                  return <Grid key={index} item xs={2}>
                    <VideoCard title={videoStreamings[name]} state={state}
                    onSeek={res => onSeek(res)} onProgress={(res) => onProgress(res)} path={getVideoPath(recordingName, name)} />
                  </Grid>
                }
              })
              }
            </Grid>
          </Box>
      }
      {
      type === dataType.AUDIO &&
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 1, md: 2 }} >
          <AudioCard state={state} onSeek={res => onSeek(res)} onProgress={(res) => onProgress(res)} path={getAudioPath(recordingName)} />
        </Grid>
      </Box>
      }
      {/* <JSONPretty id="json-pretty" data={jsonData}></JSONPretty> */}
      </AccordionDetails>
    </Accordion> 
  )
}

export default AccordionView;