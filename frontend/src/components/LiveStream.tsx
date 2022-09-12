import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { useToken } from '../api/TokenContext';
import { WS_API_URL } from '../config';
import useWebSocket, { ReadyState } from 'react-use-websocket';




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

const unpackEntries = (offsets, content, utf=false) => {
    offsets = JSON.parse(offsets);
    return offsets.map(([sid, ts, ii], i) => {
        let data = content.slice(ii, offsets?.[i+1]?.[2]);
        data = utf ? new TextDecoder("utf-8").decode(data) : data
        return [sid, ts, parseInt(ts.split('-')), data]
    })
}

const useTimeout = (callback, delay, tock=null) => {
    const cb = useRef(callback);
    useEffect(() => { cb.current = callback; }, [callback]);
    useEffect(() => {
      const id = delay && setTimeout(() => cb.current?.(), delay);
      return () => id && clearTimeout(id);
    }, [delay, tock]);
  };

const useStreamData = ({ streamId, params=null, utf=false, timeout=6000 }) => {
    // query websocket
    const { token } = useToken();
    params = token && new URLSearchParams({ token, ...params }).toString()
    const { lastMessage, readyState,  ...wsData } = useWebSocket(
        token && streamId && `${WS_API_URL}/data/${streamId}/pull?${params}`);

    // parse data
    const offsets = useRef(null);
    const [ [sid, ts, time, data], setData ] = useState([null, null, null,  null])
    useEffect(() => {
        if(!lastMessage?.data) return;
        if(typeof lastMessage?.data === 'string') {
            offsets.current = lastMessage.data;
        } else {
            lastMessage.data.arrayBuffer().then((buf) => {
                const data = unpackEntries(offsets.current, buf, utf)
                setData(data[data.length-1]);  // here we're assuming we're only querying one stream
            })
        }
    }, [lastMessage]);

    useTimeout(() => {setData([null, null, null, null])}, timeout, data)
    return {sid, ts, time, data, readyState}
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

const StreamInfo = ({ sid, time, data, readyState, children }) => {
    const openNoData = readyState == ReadyState.OPEN && !data;
    return <Box>
        <Box display='flex' sx={{ gap: '0.5em' }}>
            <Chip label={sid} size="small" />
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
    const { sid, time, data, readyState } = useStreamData({ streamId, utf: true })
    const formatted = useMemo(() => data && formatter ? formatter(data) : data, [data, formatter])
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <CodeBlock>{formatted}</CodeBlock>
        </StreamInfo>
    )
}


const canvasDimensions = (canvas, w, h, upscale=2) => {
    const parentW = canvas.parentElement.clientWidth;
    w = w || canvas.width;
    h = h || canvas.height;
    h = h * parentW/w;
    w = parentW;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const scale = window.devicePixelRatio;
    canvas.width = w * upscale;
    canvas.height = h * upscale;
}

const drawMessage = (ctx, text, fontface='Verdana') => {
    // const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    // gradient.addColorStop("0.3"," rgba(...)");
    // gradient.addColorStop("0.557", "rgba(...)");
    // gradient.addColorStop("0.818", "rgba(...)");
    // ctx.fillStyle = gradient;
    // ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height)
    // ctx.fillStyle = 'black';
    // start with a large font size
    var fontsize = 200;
    // lower the font size until the text fits the canvas
    do {
        fontsize--;
        ctx.font = fontsize + "px "+fontface;
    } while (ctx.measureText(text).width > ctx.canvas.width*0.95)
    ctx.fillText(text, ctx.canvas.width/2, ctx.canvas.height/2);
}

const useCanvas = ({}={}) => {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvasDimensions(canvas, canvas.width, canvas.height);
        canvasRef.current = canvas;
        contextRef.current = context;
        context.textBaseline = 'middle'; 
        context.textAlign = 'center'; 
        drawMessage(context, 'no data streaming')
      }, [])
    return { canvasRef, contextRef };
}

const ImageCanvas = ({ image=null, ...rest }) => {  
    const { canvasRef, contextRef } = useCanvas()
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
        }

        // attach object to image
        const src = URL.createObjectURL(new Blob([image], {type: "image/jpeg"}));
        img.src = src;
        return () => { URL.revokeObjectURL(src) }
    }, [image])
    return <canvas ref={canvasRef} style={{borderRadius: '8px', border: '2px solid #ececec'}} {...rest} />
}


export const ImageView = ({ streamId }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, params: { output: 'jpg' } })
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <ImageCanvas image={data} />
        </StreamInfo>
    )
}



export default useStreamData;