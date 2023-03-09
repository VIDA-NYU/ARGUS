// material
import Box from '@mui/material/Box'

// react
import { useState, useEffect } from 'react';

// services
import { EventsManager } from '../../tabs/HistoricalDataView/services/EventsManager';

const IMUViewer = () => {

    const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

    useEffect( () => {

        const onTimestampChange = (event: any) => {
          setCurrentTimestamp(event.timestamp);
        };
    
        // subscribing
        EventsManager.subscribe( 'onTimestampSelected', onTimestampChange );
    
      }, []);

    return(
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <h1>{currentTimestamp}</h1>
        </Box>
    )

}

export default IMUViewer;