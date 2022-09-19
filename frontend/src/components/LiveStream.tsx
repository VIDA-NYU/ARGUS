import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { ReadyState } from 'react-use-websocket';
import { useStreamData } from '../api/rest';
import exp from "constants";



const STATUS_MSG = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
}
const STATUS_COLOR = {
    [ReadyState.CONNECTING]: 'primary',
    [ReadyState.OPEN]: 'success',
    [ReadyState.CLOSING]: 'warning',
    [ReadyState.CLOSED]: 'error',
    [ReadyState.UNINSTANTIATED]: 'default',
}

export const prettyJSON = msg => msg ? JSON.stringify(JSON.parse(msg), null, 2) : msg


    

const CodeBlock = styled.pre`
background: #1975d21a;
padding: 1em;
border-radius: 1em;
max-height: 15rem;
max-width: 100vw;
overflow: auto;
font-size: 0.7em;
`

export const StreamInfo = ({ sid, time, data, readyState, children }) => {
    const openNoData = readyState == ReadyState.OPEN && !data;
    return <Box >
        <Box display='flex' sx={{ gap: '0.5em', zIndex: 1 }}>
            <Chip label={sid} size="small" color='primary' />
            {time && <Chip label={new Date(time).toLocaleString()} size="small" />}
        </Box>
    <Badge color={openNoData ? 'secondary' : STATUS_COLOR[readyState]} badgeContent={
        <Tooltip title={openNoData ? 'Open - no data' : STATUS_MSG[readyState]} placement='top'><span style={{opacity: 0}}>0</span></Tooltip>
    } sx={{display: 'block', '& .MuiBadge-badge': {height: '10px', minWidth: '10px'}}}>
        <Box>
        {children}
        </Box>
    </Badge>
</Box>
}

export const LogsView = ({ streamId, formatter=prettyJSON }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, utf: true, parse: formatter })
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <CodeBlock>{data}</CodeBlock>
        </StreamInfo>
    )
}


const canvasDimensions = (canvas, w, h) => {
    const parentW = canvas.parentElement.clientWidth;
    w = w || canvas.width;
    h = h || canvas.height;
    h = h * parentW/w;
    w = parentW;
    // canvas.style.width = w + 'px';
    // canvas.style.height = h + 'px';
    const scale = window.devicePixelRatio;
    canvas.width = w * scale;
    canvas.height = h * scale;
}

const useCanvas = ({}={}) => {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvasRef.current = canvas;
        contextRef.current = context;
    }, [])
    return { canvasRef, contextRef };
}

const ImageCanvas = ({ streamId, image=null, ...rest }) => {
    const { canvasRef, contextRef } = useCanvas();
    const { sid, time, data, readyState } = useStreamData({ streamId, utf: true });
    console.log(data, "lll");
    useEffect(() => {
        if(!image) return;

        const img = new Image();
        img.onload = e => { 
            const ctx = contextRef.current;
            // fit canvas to parent width and image aspect ratio
            const width = ctx.canvas.parentElement.clientWidth
            ctx.canvas.height = img.height / img.width * width;
            ctx.canvas.width = width;
            // draw image
            ctx.drawImage(e.target, 0, 0, ctx.canvas.width, ctx.canvas.height);


            const canvasEle = canvasRef.current;

            // draw a bounding box
            const drawBoundingBox = (info, style = {}) => {
                const { x, y, x1, y1 } = info;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 1;
                ctx.rect(x, y, x1, y1);
                ctx.stroke();

            }

            if (canvasEle) {
                console.log("Draw Bouding Boxes");
                // get context of the canvas
                let ctx = canvasEle.getContext("2d");
                // const objects = [{"xywhn":[0.15746684,0.0030323744,0.26777026,0.38022032],"confidence":0.39985728,"class_id":6,"labels":"coffee mug"},{"xywhn":[0.0,0.11014099,0.1214155,0.45666656],"confidence":0.37101164,"class_id":0,"labels":"measuring cup"}];
                for(let object of JSON.parse(data)) {
                    console.log(object);
                    object.xywhn = object.xyxyn
                    if (object.xywhn && object.xywhn[0] && object.xywhn[1] && object.xywhn[2] && object.xywhn[3]){
                        const loc2D_x =  object.xywhn[0]*ctx.canvas.width;
                        const loc2D_y =  object.xywhn[1]*ctx.canvas.height;
                        const obj_width =  object.xywhn[2]*ctx.canvas.width;
                        const obj_height =  object.xywhn[3]*ctx.canvas.height;
                        drawBoundingBox({ x: loc2D_x, y: loc2D_y, x1: obj_width, y1: obj_height });
                    }
                }
            }

        }

        // attach object to image
        const src = URL.createObjectURL(new Blob([image], {type: "image/jpeg"}));
        img.src = src;
        return () => { URL.revokeObjectURL(src) }
    }, [image])
    return <canvas ref={canvasRef} style={{width: '100%', maxWidth: '50rem', borderRadius: '8px', border: '2px solid #ececec'}} {...rest} />
}


export const ImageView = ({ streamId }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, params: { output: 'jpg' } })
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <ImageCanvas image={data} streamId={'detic:image'} />
        </StreamInfo>
    )
}



export default useStreamData;