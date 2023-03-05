// react
import React, { useEffect, useRef } from 'react';

// API
import { getVideoPath } from '../../api/rest';

// material
import Grid from '@mui/material/Grid';

// custom components
import { VideoCard  } from './VideoCard/VideoCard';

// templates
import AccordionView from '../../templates/AccordionView/AccordionView';

// model
import { streamingType } from '../../api/types';

// styles
import './VideoCard/VideoCard.css';
import './VideoDataView.css';

const VideoDataView = ({ type, title, data, recordingName, state, onProgress, onSeek }: any ) => {
    
    const videoStreamings = { [streamingType.VIDEO_MAIN]: 'Main',
        [streamingType.VIDEO_DEPTH]: 'Depth',
        [streamingType.VIDEO_GLL]: 'Grey Left-Left',
        [streamingType.VIDVIDEO_GLF]: 'Grey Left-Front',
        [streamingType.VIDEO_GRF]: 'Grey Right-Front',
        [streamingType.VIDEO_GRR]: 'Grey Right-Right'
    };
    
    const videoStreamingsIDs = Object.keys(videoStreamings);

    return (

        <div className="video-card-container">

            <div className="side-column">
                <div className="top-video">
                    <VideoCard 
                        title={videoStreamings['glf']} 
                        state={state}
                        onSeek={res => onSeek(res)} 
                        onProgress={(res) => onProgress(res)} 
                        path={getVideoPath(recordingName, 'glf')} />
                </div>
                <div className="bottom-video">
                    <VideoCard 
                        title={videoStreamings['gll']} 
                        state={state}
                        onSeek={res => onSeek(res)} 
                        onProgress={(res) => onProgress(res)} 
                        path={getVideoPath(recordingName, 'gll')} />
                </div>
            </div>

            <div className="main-column">
                <VideoCard 
                    title={videoStreamings['main']} 
                    state={state}
                    onSeek={res => onSeek(res)} 
                    onProgress={(res) => onProgress(res)} 
                    path={getVideoPath(recordingName, 'main')} />
            </div>

            <div className="side-column">
                <div className="top-video">
                    <VideoCard 
                        title={videoStreamings['grf']} 
                        state={state}
                        onSeek={res => onSeek(res)} 
                        onProgress={(res) => onProgress(res)} 
                        path={getVideoPath(recordingName, 'grf')} />
                </div>
                <div className="bottom-video">
                    <VideoCard 
                        title={videoStreamings['grr']} 
                        state={state}
                        onSeek={res => onSeek(res)} 
                        onProgress={(res) => onProgress(res)} 
                        path={getVideoPath(recordingName, 'grr')} />
                </div>
            </div>

        </div>
    )}

export default VideoDataView;