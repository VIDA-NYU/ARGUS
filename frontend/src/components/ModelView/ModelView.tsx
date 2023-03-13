// react
import { useEffect, useRef, useState } from 'react';

// material
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { TimestampManager } from '../PointCloudViewerBak/controller/TimestampManager';
import { EventsManager } from '../../tabs/HistoricalDataView/services/EventsManager';

import {AnnotationContext, AnnotationProvider, useAnnotationContext} from "./components/annotation/provider";
import ModelViewDataConsumer from "./modelview-data-consumer";

const ModelView = ({...props}) => {

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  useEffect( () => {

    const onTimestampChange = (event: any) => {
      setCurrentTimestamp(event.timestamp);
    };

    // subscribing
    EventsManager.subscribe( 'onTimestampSelected', onTimestampChange );

  }, []);

  return (
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* <h1>{currentTimestamp}</h1> */}
      {/* {props.} */}
      <AnnotationProvider>
            <AnnotationContext.Consumer>
                {({annotationData, setAnnotationData}) => (
                    <ModelViewDataConsumer
                        recordingName={props.recordingName}
                        annotationData={annotationData}
                        setAnnotationData={setAnnotationData}
                    />
                )}
            </AnnotationContext.Consumer>


        </AnnotationProvider>
    </Box>
  )

};

export default ModelView;
