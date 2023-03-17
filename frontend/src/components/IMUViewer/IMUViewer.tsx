// material
import {Box, styled, Typography} from '@mui/material';

// react
import { useState, useEffect } from 'react';

// services
import { EventsManager } from '../../tabs/HistoricalDataView/services/EventsManager';

// templates
import AccordionView from '../../templates/AccordionView/AccordionView';

// temp
import JSONPretty from 'react-json-pretty';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {computeIMUActivity, preprocessData, sampleArray} from "./visualization/utils";
import IMUActivityLineChart from "./visualization/IMU-line-chart";
//import {Dataset} from './model/dataset';
import {useRef} from "react";
import {isEmpty} from "./visualization/utils";
import IMUChartViewer from './IMUChartViewer';

const Container = styled("div")(({}) => ({
    display: "flex",
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
}))


const IMUViewer = ({type, title, data, recordingName, state, onProgress, onSeek, recordingMetaData}: any) => {
  console.log("IMUViewer");
  console.log(data);

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

    useEffect( () => {

        const onTimestampChange = (event: any) => {
          setCurrentTimestamp(event.timestamp);
        };
    
        // subscribing
        EventsManager.subscribe( 'onTimestampSelected', onTimestampChange );
    
      }, []);

  console.log(currentTimestamp);

  const emptySelection = () => {

    return( 
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h4" color="text.secondary">
            <b>IMU data loading...</b>
        </Typography>
      </Box>
  )}

  return (
    <Box sx={{ flex: 1, display: 'flex'}}>
        { data[0] ? ( <IMUChartViewer data={data} ></IMUChartViewer> ) : emptySelection() }
    </Box>
  )

}

export default IMUViewer;