// react imports
import React, { useEffect, useRef } from 'react';

// material imports
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// styles
import './styles/HistoricalDataView.css'

// data
import useSomeData from './data/HistoricalDataView.data';

// api
import { useToken } from '../../api/TokenContext';
import { 
  useGetAllRecordings, 
  // useGetRecording, 
  // useDeleteRecording, 
  // getPointCloudData, 
  // getEyeData, 
  // getIMUAccelData, 
  // getIMUGyroData, 
  getIMUMagData  } from '../../api/rest';

// global components
import Controls from '../../utils/Controls';

const HistoricalDataView = () => {

  // get the token and authenticated fetch function
  const { token, fetchAuth } = useToken();
  const { response: recordingsList } = useGetAllRecordings(token, fetchAuth);

  const { someData, loading, error } = useSomeData();

  // Recordings
  // const [availableRecordings, setAvailableRecordings] = React.useState(['']);
  // const [selectedRecordingID, setSelectedRecordingID] = React.useState<string>('');
  
  // // Initialization
  // useEffect( () => {
    
  //   // Setup/initialize recording name.
  //   recordingsList && setSelectedRecordingID(recordingsList[0]);
  //   recordingsList && setAvailableRecordings(recordingsList);

  // }, [recordingsList])

    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

        <Box sx={{ width: '100%', height: '80px', display: 'flex' }}>

          <Box sx={{ width: '400px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
                <InputLabel>Select Data</InputLabel>
                <Select
                    value={selectedRecordingID}
                    label="Select Data">
                      {   
                        availableRecordings && availableRecordings.map((recordingID, index) => (
                            <MenuItem key={'menu-item-' + index} value={recordingID}>{recordingID}</MenuItem>
                        ))
                      }
                </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', backgroundColor: 'green' }}>
          </Box>

        </Box>


        <Box sx={{ flex: 1, display: 'flex', backgroundColor: 'purple' }}>

          <Box sx={{ width: '400px', height: '100%', display: 'flex', backgroundColor: 'red' }}>
                        
          </Box>

          <Box sx={{ flex: 1, display: 'flex', backgroundColor: 'yellow' }}>

          

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