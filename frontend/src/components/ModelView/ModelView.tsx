// react
import { useEffect, useRef, useState } from 'react';

// material
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import WOZView from '../../tabs/ModelSessionView/WOZView';
import { TimestampManager } from '../PointCloudViewerBak/controller/TimestampManager';


const ModelView = ({...props}) => {

  // const deticTimestamp: number = TimestampManager.get_closest_timestamp('detic:image', props.timestamp );

  return (
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <WOZView recordingName={props.recordingName}/>
    </Box>
  )

};

export default ModelView;
