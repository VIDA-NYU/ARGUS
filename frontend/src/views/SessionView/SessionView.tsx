// react
import { useEffect, useRef, useState } from 'react';

// material
import Box from '@mui/material/Box';

// components
import PointCloudViewer from '../../components/PointCloudViewer/PointCloudViewer';

const SessionView = ( {recordingName} : any ) => {

  return (
    <Box sx={{ flex: 1, display: 'flex'}}>
        <h1>{ recordingName }</h1>
        {/* <PointCloudViewer recordingName={'2023.02.13-22.58.38'}></PointCloudViewer> */}
    </Box>
  )

};

export default SessionView;