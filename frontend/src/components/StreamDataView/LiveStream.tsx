import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { ReadyState } from 'react-use-websocket';
import { useStreamData } from '../../api/rest';

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


export const CodeBlock = styled.pre`
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
            {children ? children(data, time, sid) : <CodeBlock>{data}</CodeBlock>}
        </StreamInfo>
    )
}

export default useStreamData;