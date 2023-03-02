// react
import React, { useEffect, useRef, useState } from 'react';

// material
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

// api
import { getPointCloudData, getEyeData } from '../../api/rest';

// components
import SceneViewer from './SceneViewer';


const PointCloudViewer = ( {sessionInfo} : any ) => {

  // Attributes
  const [pointCloudData, setPointCloudData] = React.useState({});
  const [loadingPointCloud, setLoadingPointCloud ] = React.useState(false);

  useEffect(() => {

    const fetchPointCloudData = async() => {

      // setting spinner
      setLoadingPointCloud(true);
      
      const pointCloudJSONFile = await getPointCloudData( sessionInfo.recordingName );
      const eyeGazeJSONFile = await getEyeData( sessionInfo.recordingName );
      
      setPointCloudData( {'world': pointCloudJSONFile, 'gaze': eyeGazeJSONFile} );
      
      // setting spinner
      setLoadingPointCloud(false)

    }

    fetchPointCloudData();

  }, [sessionInfo])


  const loadingSpinner = () => {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress/>
      </Box>
    )
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      { loadingPointCloud ? loadingSpinner() : ( <SceneViewer pointCloudData={pointCloudData}></SceneViewer> ) }
    </Box>
  )

};

export default PointCloudViewer;
