// react
import { useEffect, useRef, useState } from 'react';

// material
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import PointCloudViewer from '../../components/PointCloudViewerBak/PointCloudViewer';

const SessionView = ( {recordingName} : any ) => {

  return (
    <Box sx={{ flex: 1, display: 'flex' }} style={{marginLeft: 15}}>
        <h2>Selected Recording: {recordingName}</h2>
        <PointCloudViewer recordingName='test-looking-around-office-9.19'></PointCloudViewer>
    </Box>
  )

};

export default SessionView;