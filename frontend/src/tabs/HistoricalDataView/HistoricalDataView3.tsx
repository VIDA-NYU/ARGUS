// react imports
import React, { useEffect } from 'react';

// material imports
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';

// styles
import './styles/HistoricalDataView.css'

// global components
import SummaryView from '../../components/SummaryView/SummaryView';
import SessionListView from '../../components/SessionListView/SessionListView';
import ModelView from '../../components/ModelView/ModelView';
import SessionView from '../../components/SessionView/SessionView';
import PointCloudViewer from './components/PointCloudViewer/PointCloudViewer';

const HistoricalDataView = () => {

  // Recordings
  const [availableRecordings, setAvailableRecordings] = React.useState([]);
  const [selectedRecordingName, setSelectedRecordingName] = React.useState<string>('');

  // fetch
  useEffect(() => {
    // Setup/initialize recording name.
    availableRecordings && availableRecordings[0] && setSelectedRecordingName(availableRecordings[0].name);
  }, [availableRecordings]);

  const handleChangeSelectRecording = (newSelection) => {
      setSelectedRecordingName(newSelection);
  }
  const updateAvailableRecordings = (updatedAvailableRecordings) => {
      setAvailableRecordings(updatedAvailableRecordings);
      // console.log(updatedAvailableRecordings);
  }
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

        <Box sx={{ flex: 1, display: 'flex'}}>

          <Box sx={{ width: '350px', height: '100%', display: 'flex', flexDirection: 'column' }}>

            <Box sx={{ height: 300 , flexDirection: 'column'}}>
                <SummaryView updateRecordings={updateAvailableRecordings}></SummaryView>
            </Box>

            <Divider />

            <Box sx={{ height: 460, flexDirection: 'column', overflow: "auto" }}>
              <SessionListView recordings={availableRecordings} onChangeSelectRecording={handleChangeSelectRecording}></SessionListView>
            </Box>

          </Box>

          <Divider orientation='vertical'/>

          <Box sx={{ flex: 1, display: 'flex' }}>
              <PointCloudViewer recordingName={'2023.02.09-16.41.00'}></PointCloudViewer>
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