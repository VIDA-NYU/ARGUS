import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { ReadyState } from 'react-use-websocket';
import { useStreamData } from '../../api/rest';
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
