// react
import { useEffect, useRef, useState } from 'react';

// material
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import PointCloudViewer from './PointCloudViewer/PointCloudViewer';


const SessionView = ( {recordingName} : any ) => {

  return (
    <Box sx={{ flex: 1, display: 'flex' }}>
        <h2>Selected Recording: <h6>{recordingName}</h6></h2>
        <PointCloudViewer recordingName='test-looking-around-office-9.19'></PointCloudViewer>
    </Box>
  )

};

export default SessionView;