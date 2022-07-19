import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { CardContent } from "@mui/material";
import ReactPlayer from "react-player";

interface AudioCardProps {
    title?: string;
    subtitle?: string;
    path: string;
    autoplay?: boolean;
  }
interface AudioCardState {

}
  
class AudioCard extends React.PureComponent<
AudioCardProps,
AudioCardState
> {
    render() {
    return (
        <Card sx={{ marginLeft: "20px", marginRight: "20px",  minWidth: 650 }}>
        <CardContent>
            <ReactPlayer
                className='react-player'
                url={this.props.path}
                width="400px"
                height="50px"
                playing = {this.props.autoplay}
                controls = {true}
            />
        </CardContent>
        </Card>
    );
    }
}

export {AudioCard};