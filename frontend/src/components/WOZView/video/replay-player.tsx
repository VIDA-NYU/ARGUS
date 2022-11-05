// react
import React, { useEffect, useRef, useState } from 'react';
import {styled} from "@mui/material";

// API
import { getVideoPath } from '../../../api/rest';
import {preprocessBoundingBoxData, preprocessFrameBoundingBoxData} from "./utils/wrapper";
// material
import Grid from '@mui/material/Grid';

// custom components
import { VideoCard } from '../../VideoDataView/VideoCard/VideoCard';

// templates
import AccordionView from '../../../templates/AccordionView/AccordionView';

// model
import { streamingType } from '../../../api/types';
import {PlayerContainer} from "./player-container";
const BoundingBoxCanvas = styled("canvas")(({}) => ({
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    width: "100%",
    height: "100%"
}))

const Container = styled("div")(({}) => ({
    position: "relative",
    top: 0,
    left: 0,
    // zIndex: 10,
}))

const VideoDataView = ({ type, title, data, recordingName, state, onProgress, onSeek, boundingBoxData, annotationData }: any ) => {

    const [count, setCount] = useState<number>(0);
    // let count = 0;
    // const processedBoundingBoxData = preprocessBoundingBoxData(boundingBoxData);
    const canvasRef = useRef<HTMLCanvasElement>();

    const {
        playing,
        controls,
        light,
        loop,
        playbackRate,
        pip,
        played,
        seeking,
        totalDuration,
        currentTime,
    } = state;



    useEffect(() => {
        // dynamically assign the width and height to canvas
        const canvasEle = canvasRef.current;
        if (canvasEle && boundingBoxData && boundingBoxData.data) {
            // canvasEle.width = canvasEle.clientWidth;
            // canvasEle.height = canvasEle.clientHeight;

            // get context of the canvas
            let ctx = canvasEle.getContext("2d");

            let x = (count % 50) * 20;
            let videoWidth = ctx.canvas.width;
            let videoHeight = ctx.canvas.height;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.beginPath();
            let frameData = preprocessFrameBoundingBoxData(boundingBoxData,
                annotationData.perceptronParameters.objectConfidenceThreshold);
            if (frameData && frameData.objects) {
                for (let object of frameData.objects) {
                    ctx.rect(object.loc2D.x * videoWidth, object.loc2D.y * videoHeight,
                        object.width * videoWidth, object.height * videoHeight);
                    ctx.font = "10px Arial";
                    ctx.fillStyle = "#ff00ff";
                    ctx.fillText(`${object.object}: ${object.instruction}`, object.loc2D.x * videoWidth, object.loc2D.y * videoHeight);
                    ctx.stroke();
                    ;
                }
            }

            // let timeRecord = seekBoundingBox(st)

            setCount(value => value + 1)
        }

    }, [played, boundingBoxData, annotationData.perceptronParameters.objectConfidenceThreshold]);
    return (
        <Container>
            <PlayerContainer
                state={state}
                onSeek={res => onSeek(res)}
                onProgress={(res) => onProgress(res)}
                path={getVideoPath(recordingName, "main")} />
            <BoundingBoxCanvas
                ref={canvasRef}
            >
            </BoundingBoxCanvas>

        </Container>
    )}

export default VideoDataView;