import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { ReadyState } from 'react-use-websocket';
import { useStreamData } from '../api/rest';
import { Code } from '@mui/icons-material';



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
    return <Box sx={{ position: 'relative', maxWidth: '100%' }}>
        <Box display='flex' sx={{ gap: '0.5em', zIndex: 1, position: 'absolute' }}>
            {sid && <Chip label={sid} size="small" color='primary' />}
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

const FORMATTERS = {
    prettyJSON,
}

export const StreamView = ({ streamId, parse=null, children=null, showStreamId=true, showTime=true, ...rest }) => {
    parse = (typeof parse === 'string') ? FORMATTERS[parse] : parse;
    const { sid, time, data, readyState } = useStreamData({ streamId, parse, ...rest })
    return (
        <StreamInfo sid={showStreamId ? sid||streamId : null} time={showTime ? time : null} data={data} readyState={readyState}>
            {children ? children(data) : <CodeBlock>{data}</CodeBlock>}
        </StreamInfo>
    )
}

export const LogsView = ({ streamId, formatter=prettyJSON, ...rest }) => {
    return <StreamView streamId={streamId} utf formatter={data => <CodeBlock>{formatter(data)}</CodeBlock>} {...rest} />
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

const ImageCanvas = ({ image=null, boxJson=null, confidence=null, ...rest }) => {
    const { canvasRef, contextRef } = useCanvas()

    // retrieve objects
    
    useEffect(() => {
        if(!image) {
            let img = new Image;
            img.src = '/brb.jpg';
            let still = true;
            img.onload = () => {
                still && contextRef.current.drawImage(
                    img,0,0,img.width,img.height,0,0, canvasRef.current.width, canvasRef.current.height)
            };
            return () => { still = false };
        }

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
            const drawBoundingBox = (info, style) => {
                const { x, y, w, h } = info;
                const { color = 'red', width = 1 } = style;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.rect(x, y, w, h);
                ctx.stroke();
            }

            // write a text (object's label)
            const drawObjectLabel = (info, style) => {
                const { text, x, y } = info;
                const { fontSize = 12, fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;
                ctx.beginPath();
                ctx.font = fontSize + 'px ' + fontFamily;
                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
                ctx.stroke();
            }

            if (canvasEle) {
                // get context of the canvas
                let ctx = canvasEle.getContext("2d");
                const W = ctx.canvas.width;
                const H = ctx.canvas.height;
                // const objects = [{"xywhn":[0.15746684,0.0030323744,0.26777026,0.38022032],"confidence":0.39985728,"class_id":6,"labels":"coffee mug"},{"xywhn":[0.0,0.11014099,0.1214155,0.45666656],"confidence":0.37101164,"class_id":0,"labels":"measuring cup"}];
                for(let object of JSON.parse(boxJson)) {
                    if(!object.xyxyn) continue;
                    if(confidence && object.confidence < confidence) continue;
                    const [x1, y1, x2, y2] = object.xyxyn;
                    drawBoundingBox({ x: x1*W, y: y1*H, w: (x2-x1)*W, h: (y2-y1)*H }, { color: 'red', width: 2 });
                    drawObjectLabel({ text: object.label, x: x1*W, y: y1*H }, { fontSize: 20, color: 'red', textAlign: 'center' });
                }
            }
        }

        // attach object to image
        const src = URL.createObjectURL(new Blob([image], {type: "image/jpeg"}));
        img.src = src;
        return () => { URL.revokeObjectURL(src) }
    }, [image])
    return <canvas ref={canvasRef} style={{width: '100%', borderRadius: '8px', border: '2px solid #ececec'}} {...rest} />
}


export const ImageView = ({ streamId, boxStreamId, ...rest }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, params: { output: 'jpg' } });
    const { data:  boxJson } = useStreamData({ streamId: boxStreamId, utf: true });
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <ImageCanvas image={data} boxJson={boxJson} {...rest} />
        </StreamInfo>
    )
}



export default useStreamData;