// react
import React, { useEffect, useRef, useState } from 'react';

// material
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

// api
import { getPointCloudData } from '../../api/rest';
import SceneViewer from './SceneViewer';


const PointCloudViewer = ( {recordingName} : any ) => {

  // Attributes
  const [pointCloudData, setPointCloudData] = React.useState({});

  useEffect(() => {

    const fetchPointCloudData = async() => {

      const pointCloudJSONFile = await getPointCloudData( recordingName );
      setPointCloudData( {'world': pointCloudJSONFile} );

    }

    fetchPointCloudData();

  }, [recordingName])


  return (
    <Box sx={{ flex: 1, display: 'flex' }}>
      <SceneViewer pointCloudData={pointCloudData}></SceneViewer>
    </Box>
  )

};

export default PointCloudViewer;
