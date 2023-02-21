// react
import { useEffect, useRef, useState } from 'react';

// material
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

// components
import PointCloudViewer from '../../components/PointCloudViewer/PointCloudViewer';

const SessionView = ( {recordingName} : any ) => { 

  const emptySelection = () => {
    return( 
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h4" color="text.secondary">
            <b>No Session selected...</b>
        </Typography>
        
      </Box>
  )}

  return (
    <Box sx={{ flex: 1, display: 'flex'}}>
        { recordingName ? ( <PointCloudViewer recordingName={recordingName}></PointCloudViewer> ) : emptySelection() }
    </Box>
  )

};

export default SessionView;