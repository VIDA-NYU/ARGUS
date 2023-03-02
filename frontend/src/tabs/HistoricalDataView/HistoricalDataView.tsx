// react imports
import React, { useEffect, useRef } from 'react';

// material imports
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';


// api
import { useToken } from '../../api/TokenContext';
import { 
  useGetAllRecordings, 
  getVideoPath,
  // useGetRecording, 
  // useDeleteRecording, 
  // getPointCloudData, 
  // getEyeData, 
  // getIMUAccelData, 
  // getIMUGyroData, 
  getIMUMagData  } from '../../api/rest';

// global components
import Controls from '../../utils/Controls';
import SummaryView from '../../components/SummaryView/SummaryView';
import SessionListView from '../../components/SessionListView/SessionListView';
import ModelView from '../../components/ModelView/ModelView';
import SessionView from '../../views/SessionView/SessionView';

const HistoricalDataView = () => {

  // Recordings
  const [availableRecordings, setAvailableRecordings] = React.useState([]);

  // session info
  const [sessionInfo, setSessionInfo] = React.useState<any>({});

  const handleChangeSelectRecording = (newSelection) => {

      const mainCameraPath: string = getVideoPath( newSelection, 'main' );

      // setting session info
      setSessionInfo({recordingName:newSelection, mainCameraPath});
  }
  const updateAvailableRecordings = (updatedAvailableRecordings) => {
      setAvailableRecordings(updatedAvailableRecordings);
  }

    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

        <Box sx={{ flex: 1, display: 'flex'}}>

          <Box sx={{ width: '350px', height: '100%', display: 'flex', flexDirection: 'column' }}>

            <Box sx={{ flex: 1 }}>
                <SummaryView updateRecordings={updateAvailableRecordings}></SummaryView>
            </Box>

            <Divider />

            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflowY: 'scroll'}}>
                <SessionListView recordings={availableRecordings} onChangeSelectRecording={handleChangeSelectRecording}></SessionListView>
              </Box>
            </Box>

          </Box>

          <Divider orientation='vertical'/>

          <Box sx={{ flex: 1, display: 'flex' }}>
              <SessionView sessionInfo={sessionInfo}></SessionView>
          </Box>

          <Divider orientation='vertical'/>

          <Box sx={{ width: '500px', display: 'flex' }}>
            <ModelView></ModelView>
          </Box>

        </Box>

      </Box>
    );
}

export default HistoricalDataView;