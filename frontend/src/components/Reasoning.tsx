import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { ReadyState } from 'react-use-websocket';
import { useStreamData } from '../api/rest';
import { StreamInfo } from './LiveStream';




export const LogsView = ({ streamId }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, utf: true, parse: JSON.parse })
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
        
        </StreamInfo>
    )
}