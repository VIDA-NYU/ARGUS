// react
import { useEffect, useRef, useState } from 'react';

// material
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import WOZView from '../../tabs/ModelSessionView/WOZView';
import { TimestampManager } from '../PointCloudViewerBak/controller/TimestampManager';
import { EventsManager } from '../../tabs/HistoricalDataView/services/EventsManager';


const ModelView = ({...props}) => {

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  useEffect( () => {

    const onTimestampChange = (event: any) => {
      setCurrentTimestamp(event.timestamp);
    };

    // subscribing
    EventsManager.subscribe( 'onTimestampSelected', onTimestampChange );

  }, []);

  // subscrib
  document.addEventListener( 'timestampEvent', () => {console.log('event fired');} )

  return (
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>{currentTimestamp}</h1>
      {/* {props.} */}
      {/* <WOZView recordingName={props.recordingName}/> */}
    </Box>
  )

};

export default ModelView;
