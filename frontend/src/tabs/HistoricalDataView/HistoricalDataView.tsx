// react imports
import React, { useEffect, useRef, useState } from 'react';

// material imports
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import { CircularProgress } from '@mui/material';

// api
import { useToken } from '../../api/TokenContext';
import { 
  useGetAllRecordings, 
  getVideoPath,
  useGetRecording, 
  getVoxelizedPointCloudData,
  // useDeleteRecording, 
  getPointCloudData, 
  getEyeData, 
  // getIMUAccelData, 
  // getIMUGyroData, 
  getIMUMagData,  
  getPerceptionData} from '../../api/rest';

// global components
import Controls from '../../utils/Controls';
import SummaryView from '../../components/SummaryView/SummaryView';
import SessionListView from '../../components/SessionListView/SessionListView';
import ModelView from '../../components/ModelView/ModelView';
import SessionView from '../../views/SessionView/SessionView';
import TimestampManager from './services/TimestampManager';
import { GazePointCloudRaw } from '../../components/PointCloudViewer/types/types';

const HistoricalDataView = () => {

  // get the token and authenticated fetch function
  // const { token, fetchAuth } = useToken();

  // Recordings
  const [availableRecordings, setAvailableRecordings] = useState([]);
  const [selectedRecordingName, setSelectedRecordingName] = React.useState<string>('');
  const [selectedTimestamp, setSelectedTimestamp] = React.useState<number>(0);

  const [sessionInfo, setSessionInfo] = useState<any>({});
  const [loadingData, setLoadingData] = useState<boolean>(false);


  const handleChangeSelectRecording = async (newSelection) => {

    setSelectedRecordingName(newSelection);
    setLoadingData(true);

    const mainCameraPath: string = getVideoPath( newSelection, 'main' );
    const pointCloudJSONFile = await getVoxelizedPointCloudData( newSelection );
    const eyeGazeJSONFile = await getEyeData( newSelection );
    const perceptionJSONFile = await getPerceptionData( newSelection );   
    // const 

    // // initializing timestamps
    TimestampManager.initialize_main_stream( eyeGazeJSONFile.map( (timestamp: GazePointCloudRaw) => parseInt(timestamp.timestamp.split('-')[0]) ) );
    // TimestampManager.index_stream_timestamp( perceptionJSONFile.map( (timestamp: any) => parseInt(timestamp.timestamp.split('-')[0]) ) );
    

    // setting session info
    setSessionInfo({recordingName:newSelection, mainCameraPath, pointCloudJSONFile, eyeGazeJSONFile});

    // setting spinner flag
    setLoadingData(false);

  }

  const updateAvailableRecordings = (updatedAvailableRecordings) => {
      setAvailableRecordings(updatedAvailableRecordings);
  }

  const loadingSpinner = () => {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress/>
      </Box>
    )
  };

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
            { loadingData ? loadingSpinner() : ( <SessionView sessionInfo={sessionInfo}></SessionView> ) }
          </Box>

          <Divider orientation='vertical'/>

          <Box sx={{ width: '500px', display: 'flex' }}>
            { selectedRecordingName && <ModelView recordingName={selectedRecordingName} ></ModelView> }
          </Box>

        </Box>

      </Box>
    );
}

export default HistoricalDataView;