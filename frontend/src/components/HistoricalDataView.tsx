import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { VideoCard } from './VideoCard';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import JSONPretty from 'react-json-pretty';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TokenProvider, useToken } from '../api/TokenContext';
import { AudioCard } from './AudioCard';
import { FormControlLabel, Switch } from '@mui/material';
import { getAudioPath, getEyeData, getHandData, getVideoPath, useGetAllRecordings, useGetRecording } from '../api/rest';
import { dataType, streamingType } from '../api/types';

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
  autoplay?: boolean 
}

const AccordionView = ({ type, title, data, recordingName, autoplay }: AccordionProps) => {
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
                    <VideoCard title={videoStreamings[name]} autoplay={autoplay} path={getVideoPath(recordingName, name)}/>
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
          <AudioCard autoplay={autoplay} path={getAudioPath(recordingName)} />
        </Grid>
      </Box>
      }
      {/* <JSONPretty id="json-pretty" data={jsonData}></JSONPretty> */}
      </AccordionDetails>
    </Accordion> 
  )
}

function RecordingsDataView() {
    const [recordingID, setRecordingID] = React.useState<number>(0);
    const [recordingName, setRecordingName] = React.useState<string>('');
    const [eyeData, setEyeData] = React.useState({});
    const [handData, setHandData] = React.useState({});
    const [autoplayStatus, setAutoplayStatus] = React.useState(false);


    // get the token and authenticated fetch function
    const { token, fetchAuth } = useToken();

    // query the streamings endpoint (only if we have a token)
    // fetch list of available recordings 
    const {response: recordingsList} = useGetAllRecordings(token, fetchAuth);
    // fetch data available of an specific recording
    const {response: recordingData} = useGetRecording(token, fetchAuth, recordingName);

    useEffect(() => {
      // Setup/initialize recording name.
      recordingsList && setRecordingName(recordingsList[0]);
    }, [recordingsList]);

    useEffect(() => {
      console.log("Autoplay click");
    }, [autoplayStatus]);

    useEffect(() => {
      const fetchEyeData = async () => {
        try {
          const jsonFile = await getEyeData(recordingName);
          setEyeData(jsonFile.slice(0, 20));
        } catch (error) {
                // console.log("error", error);
                setEyeData("404 Not Found. Eye data was not found.");
              }
      };
      const fetchHandData = async () => {
        try {
          const jsonFile = await getHandData(recordingName);
          setHandData(jsonFile.slice(0, 20));
        } catch (error) {
          // console.log("error", error);
          setHandData("404 Not Found. Hand data was not found.");
        }
      };

      if (recordingData && recordingData.streams){
        Object.keys(recordingData.streams).includes(streamingType.EYE) && fetchEyeData();
        Object.keys(recordingData.streams).includes(streamingType.HAND) && fetchHandData();
      }

    }, [recordingData]);


    const handleChange = (event: SelectChangeEvent) => {
      const index = Number(event.target.value);
      setRecordingID(index);
      recordingsList && setRecordingName(recordingsList[index]);
    };

  const renderStreamings= () => {
    if (recordingData !== undefined && recordingData &&  recordingData.streams){
      return <>
        <AccordionView type={dataType.VIDEO} data={recordingData} title={"Cameras"} autoplay={autoplayStatus} recordingName={recordingName}></AccordionView>
        {
          Object.keys(recordingData.streams).includes(streamingType.MIC) &&
          <AccordionView type={dataType.AUDIO} data={recordingData} title={"Audio Data"} autoplay={autoplayStatus} recordingName={recordingName} ></AccordionView>
        }
        {
          Object.keys(recordingData.streams).includes(streamingType.EYE) &&
          <AccordionView type={dataType.JSON} data={eyeData} title={"Eye Data"} ></AccordionView>
        }
        {
          Object.keys(recordingData.streams).includes(streamingType.HAND) &&
        <AccordionView type={dataType.JSON} data={handData} title={"Hand Data"} ></AccordionView>
        }
        </>
    }
    return <></>;
  }
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
          <InputLabel id="demo-simple-select-label">Select Data </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={recordingID.toString()}
            label="Select Data"
            onChange={handleChange}
          >
          {
            recordingsList && Array.from(Array(recordingsList.length)).map((_, index) => (
                <MenuItem key={'menu-item-' + index} value={index}>{recordingsList[index]}</MenuItem>
            ))
          }
          </Select>
        </FormControl>
      </Box>   
      <FormControlLabel
        sx={{
          display: 'block',
        }}
        control={
          <Switch
            checked={autoplayStatus}
            onChange={() => setAutoplayStatus(!autoplayStatus)}
            name="loading"
            color="primary"
          />
        }
        label={autoplayStatus ? "Play all" : "Stop all"}
      />
      {renderStreamings()}
    </div>
  );
}

// top level - wraps with a global token context
const HistoricalDataView = () => {
  return <TokenProvider>
    <RecordingsDataView />
  </TokenProvider>
}

export default HistoricalDataView;