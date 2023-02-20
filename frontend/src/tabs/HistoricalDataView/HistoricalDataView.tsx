// react imports
import React, { useEffect } from 'react';

// material imports
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';

// global components
import SummaryView from '../../components/SummaryView/SummaryView';
import SessionListView from '../../components/SessionListView/SessionListView';
import ModelView from '../../components/ModelView/ModelView';
import SessionView from '../../components/SessionView/SessionView';

const HistoricalDataView = () => {

  // Recordings
  const [availableRecordings, setAvailableRecordings] = React.useState([]);
  const [selectedRecordingName, setSelectedRecordingName] = React.useState<string>('');

  useEffect(() => {
    availableRecordings && availableRecordings[0] && setSelectedRecordingName(availableRecordings[0].name);
  }, [availableRecordings]);

  const handleChangeSelectRecording = (newSelection) => {
      setSelectedRecordingName(newSelection);
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

            <Box sx={{ flex: 1 }}>
              <h1>Session List</h1>
              {/* <SessionListView recordings={availableRecordings} onChangeSelectRecording={handleChangeSelectRecording}></SessionListView> */}
            </Box>

          </Box>

          <Divider orientation='vertical'/>

          <Box sx={{ flex: 1, display: 'flex' }}>
              {/* <SessionView></SessionView> */}
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