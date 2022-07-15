import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";

interface AudioCardProps {
    title?: string;
    subtitle?: string;
    path: string;
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
        <CardHeader
            titleTypographyProps={{
                fontSize: 16,
            }}
            // title={this.props.title}
        />
        <CardMedia
            component="audio"
            // autoPlay 
            controls 
            image={this.props.path}
            sx={{ marginLeft: "1px", marginTop: "-10px", marginBottom: "20px", marginRight: "20px" }}
        />
        </Card>
    );
    }
}

export {AudioCard};