import { useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ReactPlayer from 'react-player';
import { MediaState } from "../../HistoricalDataView";
import { onProgressType } from "../../VideoDataView/VideoCard/VideoCard";

interface AudioCardProps {
    path: string;
    state: MediaState;
    onProgress?: (changeState: onProgressType) => void;
    onSeek?: (seek: number) => void;
}


function AudioCard(props: AudioCardProps) {

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
        <>
        <Card sx={{ marginLeft: "20px", marginRight: "20px",  minWidth: 650 }}>
        <CardContent>
            <ReactPlayer
                ref = {playerRef}
                url={props.path}
                width="400px"
                height="50px"
                playing = {playing}
                controls = {true}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                onSeek={handleSeeking}
            />
        </CardContent>
        </Card>
        </>
    );
}

export {AudioCard};