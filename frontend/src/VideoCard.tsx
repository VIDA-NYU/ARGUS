import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import ReactPlayer from 'react-player'

interface VideoCardProps {
    title: string;
    subtitle: string;
  }
interface VideoCardState {

}
  
class VideoCard extends React.PureComponent<
VideoCardProps,
VideoCardState
> {
    render() {
    return (
        <Card sx={{ maxWidth: 400 }}>
        <CardHeader
            titleTypographyProps={{
                fontSize: 16,
            }}
            title={this.props.title}
            subheader={this.props.subtitle}
        />
        {/* <CardMedia
            component="video"
            autoPlay 
            controls 
            image="/videos/gll.mp4"
        /> */}
        <CardContent>
            <ReactPlayer
                url="/videos/gll.mp4"
                // url='https://vimeo.com/243556536'
                width='100%'
                height='100%'
                controls = {true}

                />
        </CardContent>
        </Card>
    );
    }
}

export {VideoCard};