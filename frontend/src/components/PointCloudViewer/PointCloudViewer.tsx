// react
import React, { useEffect } from 'react';

// material
import Box from '@mui/material/Box';

// components
import SceneViewer from './SceneViewer';

const PointCloudViewer = ( {sessionInfo} : any ) => {

  // Attributes
  const [sceneData, setSceneData] = React.useState({});

  useEffect(() => {
    setSceneData({videoData: sessionInfo.mainCameraPath, IMUAccelData: sessionInfo.IMUAccelFile, IMUGyroData: sessionInfo.IMUGyroFile, IMUMagData: sessionInfo.IMUMagFile, pointCloudData: {'world': sessionInfo.pointCloudJSONFile, 'gaze': sessionInfo.eyeGazeJSONFile}} );
  }, [sessionInfo])

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <SceneViewer sceneData={sceneData}></SceneViewer>
    </Box>
  )

};

export default PointCloudViewer;
