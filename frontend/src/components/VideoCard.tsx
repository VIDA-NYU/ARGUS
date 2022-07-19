import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import ReactPlayer from 'react-player';

interface VideoCardProps {
    title: string;
    subtitle?: string;
    path: string;
    autoplay?: boolean;
  }
interface VideoCardState {

}
  
class VideoCard extends React.PureComponent<
VideoCardProps,
VideoCardState
> {
    render() {
console.log("autoplay videocard: " , this.props.autoplay);

    return (
        <>
        <div className='player-wrapper'>
        </div>
        <Card sx={{ maxWidth: 600 }}>
        <CardHeader
            titleTypographyProps={{
                fontSize: 16,
            }}
            title={this.props.title}
            // subheader={this.props.path}
        />
        <CardContent>
            <ReactPlayer
                url={this.props.path}
                width='100%'
                height='100%'
                playing = {this.props.autoplay}
                controls = {true}
                playbackRate = {5}
            />
        </CardContent>
        </Card>
        </>
    );
    }
}

export {VideoCard};