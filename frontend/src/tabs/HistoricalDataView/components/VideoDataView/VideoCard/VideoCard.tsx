import {styled} from "@mui/material";

import React, { useEffect, useRef } from "react";
import ReactPlayer from 'react-player';

import { MediaState } from "../../../types/types";

// templates

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


// styles
const VideoContainer = styled("div")({
   width: '100%',
   height: '100%',
   display: 'flex',
   flexDirection: 'column',
})

const ContainerHeader = styled("div")({
    width: '100%',
    height: '50px',
    display: 'flex',
    justifyContent: 'center'
})

const ContainerBody = styled("div")({
    width: '100%',
    height: `calc(100% - 80px)`,
    display: 'flex',
    position: 'relative'
})


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

        <VideoContainer>
            
            <ContainerHeader>
                <h3 style={{ color: 'grey' }}>{props.title}</h3>  
            </ContainerHeader>

            <ContainerBody>
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
            </ContainerBody>


        </VideoContainer>
        
    );
}

export {VideoCard};