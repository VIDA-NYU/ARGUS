import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const ReasoningOutputsView = ({ data }) => {
    const { step_id, step_status, step_description, error_status, error_description } = data || {};
    return <Box>
      <Chip 
        label={<span>{step_id && <b>{step_id}:</b>}{step_description || 'no active step.'} <b>{step_status}</b></span>} 
        color={step_status === 'NEW' ? 'success' : step_status === 'IN_PROGRESS' ? 'primary' : 'default'} />
      <Chip 
        label={error_description || 'no errors.'} 
        color={error_status ? 'error' : 'default'} />
      {/* <Box>
        <Button><ArrowBackIcon /></Button>
        <Button><ArrowForwardIcon /></Button>
        <Button><RestartAltIcon /></Button>
      </Box> */}
    </Box>
  }