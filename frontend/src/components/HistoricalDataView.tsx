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
import { API_URL, RECORDINGS_STATIC_PATH } from '../config';
import useSWR, { Key } from 'swr';
import { AudioCard } from './AudioCard';

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
  recordingName?: string
}

enum dataType {
  VIDEO = 'VIDEO',
  JSON = 'JSON',
  AUDIO = 'AUDIO',
}

const AccordionView = ({ type, title, data, recordingName }: AccordionProps) => {
  const videoStreamings = {"main": 'Main',
                     "depthlt": 'Depth',
                     "gll": 'Grey Left-Left',
                     "glf": 'Grey Left-Front',
                     "grf": 'Grey Right-Front',
                     "grr": 'Grey Right-Right'
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
              data !== undefined && data && data.streams &&
              videoStreamingsIDs.map((name, index) => {
                const streams = Object.keys(data.streams);
                if (streams.includes(name)){ //verify if stream exists.
                  return <Grid key={index} item xs={2}>
                    <VideoCard title={videoStreamings[name]} path={API_URL + RECORDINGS_STATIC_PATH + `${recordingName}/${name}.mp4`}/>
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
          {
          data !== undefined && data && data.streams && Object.keys(data.streams).includes("mic0") &&
            <AudioCard path={API_URL + RECORDINGS_STATIC_PATH + `${recordingName}/mic0.wav`}/>
          }
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


    // get the token and authenticated fetch function
    const { token, fetchAuth } = useToken();
    const fetcher = (url: string) => fetchAuth !== undefined && fetchAuth !== "" && fetchAuth(url).then((res) => res.json());

    // query the streamings endpoint (only if we have a token)
    // fetch list of available recordings 
    const uid: Key = token && `${API_URL}/recordings`;
    const { data: recordingsList, error } = useSWR(uid, fetcher);

    // fetch data available of an specific recording
    const uidRecordID: Key = token && `${API_URL}/recordings/` + recordingName;
    const { data: recordingData } = useSWR(uidRecordID, fetcher);


    useEffect(() => {
      // Setup/initialize recording name.
      recordingsList && setRecordingName(recordingsList[0]);
    }, [recordingsList]);

    useEffect(() => {
      const fetchEyeData = async () => {
        try {
          // const url ="https://api.ptg.poly.edu/recordings/static/coffee-test-1/eye.json";
          const url = API_URL +  RECORDINGS_STATIC_PATH + `${recordingName}/eye.json`;
          const res = await fetch(url);
          const jsonFile = await res.json();
          setEyeData(jsonFile.slice(0, 20));
        } catch (error) {
                // console.log("error", error);
                setEyeData("404 Not Found. Eye data was not found.");
              }
      };
      const fetchHandData = async () => {
        try {
          // const url ="https://api.ptg.poly.edu/recordings/static/coffee-test-1/hand.json";
          const url = API_URL +  RECORDINGS_STATIC_PATH + `${recordingName}/hand.json`;
          const res = await fetch(url);
          const jsonFile = await res.json();
          setHandData(jsonFile.slice(0, 20));
        } catch (error) {
          // console.log("error", error);
          setHandData("404 Not Found. Hand data was not found.");
        }
      };

      if (recordingData && recordingData.streams){
        Object.keys(recordingData.streams).includes('eye') && fetchEyeData();
        Object.keys(recordingData.streams).includes('hand') && fetchHandData();
      }

    }, [recordingData]);


    const handleChange = (event: SelectChangeEvent) => {
      const index = Number(event.target.value);
      setRecordingID(index);
      recordingsList && setRecordingName(recordingsList[index]);
    };

  const renderStreamings= () => {
    if (recordingData &&  recordingData.streams){
      return <>
        <AccordionView type={dataType.VIDEO} data={recordingData} title={"Cameras"} recordingName={recordingName}></AccordionView>
        {
          Object.keys(recordingData.streams).includes('mic0') &&
          <AccordionView type={dataType.AUDIO} data={recordingData} title={"Audio Data"} recordingName={recordingName} ></AccordionView>
        }
        {
          Object.keys(recordingData.streams).includes('eye') &&
          <AccordionView type={dataType.JSON} data={eyeData} title={"Eye Data"} ></AccordionView>
        }
        {
          Object.keys(recordingData.streams).includes('hand') && 
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
              {recordingsList && Array.from(Array(recordingsList.length)).map((_, index) => (
                  <MenuItem key={'menu-item-' + index} value={index}>{recordingsList[index]}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>   
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