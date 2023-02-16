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

          <Box sx={{ width: '420px', height: '100%', display: 'flex', flexDirection: 'column' }}>

            <Box sx={{ height: 300 , flexDirection: 'column', overflow: "auto" }}>
                <SummaryView updateRecordings={updateAvailableRecordings}></SummaryView>
            </Box>

            <Divider />

            <Box sx={{ height: 400, flexDirection: 'column', overflow: "auto" }}>
              <SessionListView recordings={availableRecordings} onChangeSelectRecording={handleChangeSelectRecording}></SessionListView>
            </Box>

          </Box>

          <Divider orientation='vertical'/>

          <Box sx={{ flex: 1, display: 'flex' }}>
              <SessionView recordingName={selectedRecordingName}></SessionView>
          </Box>

          <Divider orientation='vertical'/>

          <Box sx={{ width: '500px', display: 'flex' }}>
            <ModelView></ModelView>
          </Box>

        </Box>

      </Box>

        // <div style={{ display: 'flex', flex: 1, backgroundColor: 'pink'}}>

        //   <div className='controls-wrapper'>
        //       <Box sx={{ flexGrow: 1 }}>
        //           <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
        //               <InputLabel id="demo-simple-select-label">Select Data </InputLabel>
        //               <Select
        //                   labelId="demo-simple-select-label"
        //                   id="demo-simple-select"
        //                   value={'0'}
        //                   label="Select Data">
        //               </Select>
        //           </FormControl>
        //       </Box>

  

        //     </div>

        //     <div className="layer-wrapper">

        //         <div className="layer-component">

        //           <ComponentTemplate title={'Video Mosaic'}>
        //             <VideoDataView 
        //               type={dataType.VIDEO} 
        //               data={recordingData} 
        //               title={"Cameras"} 
        //               state={state} 
        //               recordingName={recordingName} 
        //               onProgress={(res) => handleProgress(res)} 
        //               onSeek={res => handleSeekingFromVideoCard(res)}>
        //             </VideoDataView>
        //           </ComponentTemplate>

        //         </div>

        //         <div className="layer-component">

        //           <ComponentTemplate title={'3D View'}>
        //             <PointCloudViewer
        //               pointCloudRawData={pointCloudData}
        //               videoState={state}
        //               recordingMetadata={recordingData}
        //               // worldPointCloudData={pointCloudData}
        //               // gazePointCloudData={eyeData}
        //               >
        //             </PointCloudViewer>
        //           </ComponentTemplate>
                  
        //         </div>

        //     </div>

        //     <div className="layer-wrapper">
        //         <IMUDataView data={imudata} videostate={state} videometadata={recordingData}></IMUDataView>
        //     </div>
            
        //  </div>
    );
}

export default HistoricalDataView;