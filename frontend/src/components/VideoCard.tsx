import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import ReactPlayer from 'react-player'

interface VideoCardProps {
    title: string;
    subtitle: string;
    path: string;
  }
interface VideoCardState {

}
  
class VideoCard extends React.PureComponent<
VideoCardProps,
VideoCardState
> {
    render() {
    return (
        <Card sx={{ maxWidth: 300 }}>
        <CardHeader
            titleTypographyProps={{
                fontSize: 16,
            }}
            title={this.props.title}
            // subheader={this.props.subtitle}
        />
        <CardMedia
            component="video"
            // autoPlay 
            controls 
            image={this.props.path}
        />
        {/* <CardContent>
            <ReactPlayer
                url={this.props.path}//"http://localhost:4000/video"
                //"/videos/gll.mp4"
                // url='https://vimeo.com/243556536'
                width='150px'
                height='150px'
                controls = {true}

                />
        </CardContent> */}
        </Card>
    );
    }
}

export {VideoCard};