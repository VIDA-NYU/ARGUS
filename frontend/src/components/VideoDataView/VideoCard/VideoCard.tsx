import React, { useEffect, useRef } from "react";
import ReactPlayer from 'react-player';
import { MediaState } from "../../HistoricalDataView";

// material
import Card from "@mui/material/Card";
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";

interface VideoCardProps {
    title: string;
    subtitle?: string;
    path: string;
    state?: MediaState;
    onProgress?: (changeState: onProgressType) => void;
    onSeek?: (seek: number) => void;
  }

export interface onProgressType {
    loaded: number;
    loadedSeconds: number;
    played: number;
    playedSeconds: number;
    totalDuration?: string;
    currentTime?: string;
}

function VideoCard(props: VideoCardProps) {

    const playerRef = useRef(null);
    const {
        playing,
        controls,
        light,
        loop,
        playbackRate,
        pip,
        played,
        seeking,
    } = props.state;
    useEffect(() => {
        const handleChangePlayed = (played) => {
            playerRef.current.seekTo(played)
        }
        if ((played || played===0 ) && seeking ) {
            handleChangePlayed(played);
         }
      }, [played]);

      const handleProgress  = (changeState: onProgressType) => {
        const duration = playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";
        const currentTime = playerRef && playerRef.current
            ? playerRef.current.getCurrentTime()
            : "00:00";
        props.onProgress({...changeState, totalDuration: duration, currentTime: currentTime});
      }

      const handleSeeking = (e) => {
          props.onSeek(e);
      }


    return (
        <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '50px', width: '100%', display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                <Typography>{props.title}</Typography>
            </Box>

            <Box sx={{ height: 'calc(100% - 50px)', width: '100%', position: 'relative' }}>
                <ReactPlayer
                    className='react-player'
                    ref = {playerRef}
                    url={props.path}
                    width='100%'
                    height='100%'
                    playing = {playing}
                    controls = {false}
                    playbackRate={playbackRate}
                    onProgress={handleProgress}
                    onSeek={handleSeeking}/>
            </Box>            
        </Card>
    );
}

export {VideoCard};