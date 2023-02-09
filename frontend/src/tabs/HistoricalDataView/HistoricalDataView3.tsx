// react imports
import React, { useEffect, useRef } from 'react';

// styles
import './styles/HistoricalDataView.css'

const HistoricalDataView = () => {

    return (
        <div className='main-wrapper'>

          {/* <div className='controls-wrapper'>
              <Box sx={{ flexGrow: 1 }}>
                  <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
                      <InputLabel id="demo-simple-select-label">Select Data </InputLabel>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={recordingID.toString()}
                          label="Select Data"
                          onChange={handleChangeRecording}>
                          {   
                              recordings && Array.from(Array(recordings.length)).map((_, index) => (
                                  <MenuItem key={'menu-item-' + index} value={index}>{recordings[index]}</MenuItem>
                              ))
                          }
                      </Select>
                  </FormControl>
              </Box>

              <Controls
                  ref={controlsRef}
                  onSeek={handleSeekChange}
                  onSeekMouseDown={handleSeekMouseDown}
                  onSeekMouseUp={handleSeekMouseUp}
                  onDuration={handleDuration}
                  onRewind={handleRewind}
                  onPlayPause={handlePlayPause}
                  onFastForward={handleFastForward}
                  playing={playing}
                  played={played}
                  elapsedTime={elapsedTime}
                  totalDuration={totalDurationValue}
                  onChangeDispayFormat={handleDisplayFormat}
                  playbackRate={playbackRate}
                  onPlaybackRateChange={handlePlaybackRate}
                  onToggleFullScreen={toggleFullScreen}
              />

            </div>

            <div className="layer-wrapper">

                <div className="layer-component">

                  <ComponentTemplate title={'Video Mosaic'}>
                    <VideoDataView 
                      type={dataType.VIDEO} 
                      data={recordingData} 
                      title={"Cameras"} 
                      state={state} 
                      recordingName={recordingName} 
                      onProgress={(res) => handleProgress(res)} 
                      onSeek={res => handleSeekingFromVideoCard(res)}>
                    </VideoDataView>
                  </ComponentTemplate>

                </div>

                <div className="layer-component">

                  <ComponentTemplate title={'3D View'}>
                    <PointCloudViewer
                      pointCloudRawData={pointCloudData}
                      videoState={state}
                      recordingMetadata={recordingData}
                      // worldPointCloudData={pointCloudData}
                      // gazePointCloudData={eyeData}
                      >
                    </PointCloudViewer>
                  </ComponentTemplate>
                  
                </div>

            </div>

            <div className="layer-wrapper">
                <IMUDataView data={imudata} videostate={state} videometadata={recordingData}></IMUDataView>
            </div> */}
            
        </div>
    );
}

export default HistoricalDataView;