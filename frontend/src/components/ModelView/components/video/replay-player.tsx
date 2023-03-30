// react
import { useEffect, useRef, useState } from 'react';
import {styled} from "@mui/material";

// API
import { getVideoPath } from '../../../../api/rest';
import {ObjectRecord, preprocessFrameBoundingBoxData} from "./utils/wrapper";

// model
import {PlayerContainer} from "./player-container";

import {syncWithVideoTime} from "./utils/wrapper";


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

const validCanvasWidthLower = 800;


const VideoDataView = ({ type, title, data, recordingName, state, onProgress, onSeek, boundingBoxData, annotationData, currentTime }: any ) => {
    const [count, setCount] = useState<number>(0);
    // let count = 0;
    // const processedBoundingBoxData = preprocessBoundingBoxData(boundingBoxData);
    const canvasRef = useRef<HTMLCanvasElement>();
    const [canvasRatio, setCanvasRatio] = useState<number>(1);
    const [originalVideoWidth, setOriginalVideoWidth] = useState<number>(0);
    const [originalVideoHeight, setOriginalVideoHeight] = useState<number>(0);
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
    } = state;

    const computeCanvasRatio = (videoWidth: number, lowerBound: number) => {
        if(videoWidth >= lowerBound){
            return 1;
        }else{
            return Math.ceil(lowerBound / videoWidth);
        }
    }

    useEffect(() => {
        if(canvasRef && canvasRef.current){
            let ctx = canvasRef.current.getContext("2d");
            let videoWidth = ctx.canvas.width;
            let videoHeight = ctx.canvas.height;

            if(originalVideoWidth === 0 && originalVideoHeight === 0){
                ctx.canvas.style.width = `${videoWidth}`;
                ctx.canvas.style.height = `${videoHeight}`;
                setOriginalVideoWidth(videoWidth);
                setOriginalVideoHeight(videoHeight);
            }
            let ratio = computeCanvasRatio(videoWidth, validCanvasWidthLower);
            ctx.canvas.width = ratio * videoWidth
            ctx.canvas.height = ratio * videoHeight;
            setCanvasRatio(ratio);
        }
    }, [canvasRef.current])

    useEffect(() => {

        // dynamically assign the width and height to canvas
        const canvasEle = canvasRef.current;

        const dataAttr = boundingBoxData && Object.keys(boundingBoxData).indexOf("data") != -1 ? "data" : "values";

        if (canvasEle && boundingBoxData && boundingBoxData[dataAttr]) {
            // canvasEle.width = canvasEle.clientWidth;
            // canvasEle.height = canvasEle.clientHeight;
            // get context of the canvas
            let ctx = canvasEle.getContext("2d");

            const drawBoundingBox = (objectRecord: ObjectRecord, videoWidth: number, videoHeight: number, style) => {
                const { color = 'red', width = 1, alpha=0.2 } = style;
                ctx.beginPath();
                ctx.moveTo(objectRecord.loc2D.x, objectRecord.loc2D.y);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                // const prevAlpha = ctx.globalAlpha
                // ctx.globalAlpha = alpha;
                ctx.rect(objectRecord.loc2D.x * videoWidth, objectRecord.loc2D.y * videoHeight,
                    objectRecord.width * videoWidth, objectRecord.height * videoHeight);
                // ctx.globalAlpha = prevAlpha;
                ctx.stroke();
            }

            const drawObjectLabel = (objectRecord: ObjectRecord, videoWidth: number, videoHeight: number, style) => {
                let x = objectRecord.loc2D.x * videoWidth;
                let y = objectRecord.loc2D.y * videoHeight;
                let {
                    fontSize = 11, fontFamily = 'Arial', color = 'black',
                    textAlign = 'left', textBaseline = 'top', pad=2, bgAlpha=0.7
                } = style;
                if(textAlign == 'center') {
                    x = x + videoWidth * objectRecord.width/2-pad;
                }

                // draw background box
                ctx.fillStyle = color;
                const { width } = ctx.measureText(objectRecord.object);
                const prevAlpha = ctx.globalAlpha
                ctx.globalAlpha = bgAlpha;
                ctx.fillRect(
                    x - width*(textAlign == 'center' ? 0.5 : 9),
                    objectRecord.loc2D.y * videoHeight,
                    width+pad*2, fontSize+pad*2);
                ctx.globalAlpha = prevAlpha;

                // draw
                ctx.font = fontSize + 'px ' + fontFamily;
                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;
                ctx.fillStyle = 'white';
                ctx.fillText(objectRecord.object, x+pad, y+pad);

            }

            let videoWidth = ctx.canvas.width;
            let videoHeight = ctx.canvas.height;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            // ctx.beginPath();


            const syncedBoundingBoxData = syncWithVideoTime(currentTime, state, annotationData.meta.entryTime, boundingBoxData)
            let frameData = preprocessFrameBoundingBoxData(syncedBoundingBoxData,
                annotationData.perceptronParameters.objectConfidenceThreshold);

            if (frameData && frameData.objects) {
                for (let object of frameData.objects) {
                    // ctx.rect(object.loc2D.x * videoWidth, object.loc2D.y * videoHeight,
                    //     object.width * videoWidth, object.height * videoHeight);
                    // ctx.font = "10px Arial";
                    // ctx.fillStyle = "#ff00ff";
                    // ctx.fillText(`${object.object}: ${object.instruction}`, object.loc2D.x * videoWidth, object.loc2D.y * videoHeight);
                    // ctx.stroke();
                    drawBoundingBox(object, videoWidth, videoHeight, { color: 'red', width: 1.5 });
                    drawObjectLabel(object, videoWidth, videoHeight, { color: 'red', textAlign: 'center' })
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