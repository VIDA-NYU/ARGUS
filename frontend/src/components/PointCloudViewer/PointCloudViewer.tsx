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
    setSceneData({
      videoData: sessionInfo.mainCameraPath, 
      pointCloudData: {'world': sessionInfo.pointCloudJSONFile, 'gaze': sessionInfo.eyeGazeJSONFile, 'hand': sessionInfo.handDataJSONFile}, 
      modelData: {'perception': sessionInfo.perceptionJSONFile, 'perception3D': sessionInfo.perception3DJSONFile }
      });

      // IMUAccelData: sessionInfo.IMUAccelFile, IMUGyroData: sessionInfo.IMUGyroFile, IMUMagData: sessionInfo.IMUMagFile
  }, [sessionInfo])

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {( 'pointCloudData' in sceneData ) ? (<SceneViewer sceneData={sceneData}></SceneViewer>): <></>}
    </Box>
  )

};

export default PointCloudViewer;
