import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface VideoData {
    id: number,
    poster: string,
    duration: string,
    name: string
}
interface Data {
  id: number,
  name: string,
  files: string [],
  totalCameras: number
}

interface JsonProps {
  jsonData: any,
  title: string,
}
const JsonView = ({ jsonData, title }: JsonProps) => {
 return  <Accordion defaultExpanded={true} >
 <AccordionSummary
   expandIcon={<ExpandMoreIcon />}
   aria-controls="panel2a-content"
   id="panel2a-header"
 >
   <Typography>{title}</Typography>
 </AccordionSummary>
 <AccordionDetails>
   <Box style={{maxHeight: 400, overflow: 'auto'}}
   sx={{
     backgroundColor: '#f9f9f9',
     '&:hover': {
       backgroundColor: '#E5E5E5',
       opacity: [0.9, 0.8, 0.7],
     },
   }}>
     {JSON.stringify(jsonData)}
     {/* <JSONPretty id="json-pretty" data={jsonData}></JSONPretty> */}
   </Box>
 </AccordionDetails>
</Accordion> 
}

export default function HistoricalDataView() {
    const cameraNames = {"main": 'Main',
                     "depthlt": 'Depth',
                     "gll": 'Grey Left-Left',
                     "glf": 'Grey Left-Front',
                     "grf": 'Grey Right-Front',
                     "grr": 'Grey Right-Right'
    };
    const [cameraId, setCamera] = React.useState<number>(0);
    const [videos, setVideos] = React.useState<VideoData[]>([]);
    const [data, setData] = React.useState<Data[]>([]);
    const [eyeData, setEyeData] = React.useState({});
    const [handData, setHandData] = React.useState({});

    useEffect(() => {
      const fetchVideoData = async () => {
        const res = await fetch(
          'http://localhost:4000/videos',
        );
        const videos = await res.json();
        setVideos(videos);
      };
      fetchVideoData();
    }, [setVideos]);

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch(
          'http://localhost:4000/data',
        );
        const data = await res.json();
        console.log("data");
        console.log(data);
        setData(data);
      };
      fetchData();
    }, [setData]);

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch(
          `http://localhost:4000/files/${data[cameraId].name}/${data[cameraId].files[6]}`,
        );
        const jsonFile = await res.json();
        setEyeData(jsonFile);
      };
      if (data !== undefined && data[cameraId] != undefined) {
        fetchData();
      }
    }, [cameraId, data]);

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch(
          `http://localhost:4000/files/${data[cameraId].name}/${data[cameraId].files[7]}`,
        );
        const jsonFile = await res.json();
        console.log(jsonFile);
        setHandData(jsonFile);
      };
      if (data !== undefined && data[cameraId] != undefined) {
        fetchData();
      }
    }, [cameraId, data]);


    const handleChange = (event: SelectChangeEvent) => {
      setCamera(Number(event.target.value));
    };

  return (
      <div>
        {/* <div>
          {videos != undefined && videos.map((video: VideoData) => (
            <li key={video.id}>
              <div className="card border-0">
                  <img src={`http://localhost:4000${video.poster}`} alt={video.name} />
                  <div className="card-body">
                      <p>{video.name}</p>
                      <p>{video.duration}</p>
                  </div>
              </div>
            </li>
          ))}
          </div> 
        */}
    <Box sx={{ flexGrow: 1 }}>
      <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
        <InputLabel id="demo-simple-select-label">Select Data </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={cameraId.toString()}
          label="Select Data"
          onChange={handleChange}
        >
            {Array.from(Array(data.length)).map((_, index) => (
                <MenuItem key={'menu-item-' + index} value={index}>{data[index].name}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
    
    <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Cameras</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 1, md: 2 }} >
            {data !== undefined && data[cameraId] != undefined &&
            Array.from(Array(data[cameraId].totalCameras)).map((_, index) => (
              <Grid key={index} item xs={2}>
                <VideoCard title={cameraNames[data[cameraId].files[index]]} subtitle={"130 frames"} path={`http://localhost:4000/video/${data[cameraId].name}/${data[cameraId].files[index]}`}/>
              </Grid>
            ))}
          </Grid>
          
        </Box>
        </AccordionDetails>
      </Accordion>    
      <JsonView jsonData={eyeData} title={"Eye Data"}></JsonView>
      <JsonView jsonData={handData} title={"Hand Data"}></JsonView>
    </div>
  );
}