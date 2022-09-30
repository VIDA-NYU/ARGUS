import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { ReadyState } from 'react-use-websocket';
import { useStreamData } from '../../api/rest';
import { StreamInfo } from './LiveStream';
import colormap from 'colormap';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';

let probColors = colormap({
    colormap: 'winter',
    nshades: 10,
    format: 'rgbaString',
    alpha: [0, 1],
})
// console.log(probColors)
  
interface ClipOutputsViewProps { data: { [key: string]: number; }, min?: number }
  
export const ClipOutputsView = ({ data, min=0 }: ClipOutputsViewProps) => {
    const entries = data && Object.entries(data)
    const noAction = entries && entries.every(([t,s]) => s === 0)
    return data && (<Box display='flex' flexDirection='column'>
      {noAction && <Chip label='No Action' color='error' />}
      {entries.sort(([ta, sa], [tb,sb]) => ( sb-sa ))
             .slice(0, noAction ? 4 : 5)
             .map(([text, similarity]) => (
              <Chip key={text} label={`${text}: ${(similarity*100).toFixed(2)}`} sx={{ 
                backgroundColor: probColors[Math.round(Math.max(1, similarity*(probColors.length-1)))],
                opacity: similarity > min ? 1 : 0,//Math.max(0.7, similarity),
                transition: 'opacity 0.4s ease-in-out',
              }} />
      ))}
    </Box>)
}

export const ClipOutputsLiveView = ({ data, min=0 }: ClipOutputsViewProps) => {
  const entries = data && Object.entries(data)
  const noAction = entries && entries.every(([t,s]) => s === 0)
  return data && (<Box display='flex' flexDirection='column'>
    {noAction && <span style={{margin: 5, color: 'red'}}>No Action</span>}
    {entries.sort(([ta, sa], [tb,sb]) => ( sb-sa ))
           .slice(0, noAction ? 4 : 5)
           .map(([text, similarity]) => (
            <li key={text}
              // style={{ 
              // color: probColors[Math.round(Math.max(1, similarity*(probColors.length-1)))],
              // opacity: similarity > min ? 1 : 0,//Math.max(0.7, similarity),
              // transition: 'opacity 0.4s ease-in-out',}}
              ><b>{text}</b>: {(similarity*100).toFixed(2)}
            </li>
    ))}
  </Box>)
}
