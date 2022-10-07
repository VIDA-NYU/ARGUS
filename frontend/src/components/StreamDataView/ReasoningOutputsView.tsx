import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip, IconButton, Icon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useRecordingControls } from '../../api/rest';
import DoneIcon from '@mui/icons-material/Done';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { blue, green } from '@mui/material/colors';

export const ReasoningOutputsView = ({ data }) => {
    const { step_id, step_status, step_description, error_status, error_description } = data || {};
    const { setStep } = useRecordingControls();
    const current_step = step_id + 1; // Reasoning handles indexes, so we need to add 1 to communicate the user they are in the first (1) step.
    return <Box display='flex' flexDirection='column' pt={5} mr={2} ml={2}>
      <span><b>Current Step:</b>{current_step}</span>
      {/* <span><b>Current Step:</b>{step_id || ' No active step.'}</span> */}
      <span><b>Description:</b> {step_description || 'No active step.'}</span>
      <span><b>Status:</b> {step_status}</span>
      <br/>
      <span><b>Errors:</b> {error_description || 'No errors.'}</span>
    </Box>

}


const ListSteps = ({list, completedStep}: {list: string [], completedStep: number}) => {
  return (
    <ol key={'steps_all'}>{
        list.map((value: string, index: number ) => {
          return index < completedStep ? (
              <li key={'steps_'+index} style={{color:"green"}}> {value} <DoneIcon sx={{ color: green[500], fontSize: 25}}></DoneIcon>
              </li>
            ) : index === completedStep ? (
              <li key={'steps_'+index} style={{color:"blue"}}> {value} <RotateLeftIcon sx={{ color: blue[700], fontSize: 25}}></RotateLeftIcon>
              </li>
            ) : (
              <li key={'steps_'+index}>  {value} </li>
            );
          })
        }
      </ol>
  )
}
export const ReasoningOutputsWOZView = ({ data, recipe }) => {
    const { step_id, step_status, step_description, error_status, error_description } = data || {};
    // let step_id = 0;
    const current_step = step_id + 1;
    const { setStep } = useRecordingControls();
    const step_id_previous = (step_id -1).toString();
    const step_id_next = (step_id +1).toString();
    return <Box display='flex' flexDirection='column' pt={0} mr={2} ml={2}>
      <span style={{paddingBottom: 7}} ><b>{recipe && recipe.name} Recipe Steps</b></span>
      <span><b>Current Step: </b>{current_step} - <b>  Status:</b> {step_status}</span>
      {recipe && recipe.instructions && <ListSteps list={recipe.instructions} completedStep={step_id}/>}
      <Box>
        <Button onClick={() => setStep({ step_id_s: step_id_previous})} variant="contained" style={{margin: 6}}><ArrowBackIcon /> Previous Step</Button>
        <Button  onClick={() => setStep({ step_id_s: step_id_next})} variant="contained"><ArrowForwardIcon />Next Step</Button>
      </Box> 
    </Box>

  }