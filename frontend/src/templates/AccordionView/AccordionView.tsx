// react
import React, { ReactElement, useEffect, useRef } from 'react';

// material
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

interface AccordionViewTemplateProps {
  title: string,
  children: ReactElement,
  height: number
}

const AccordionView = ( { children, title, height }: AccordionViewTemplateProps ) => {
  
  return (
    <Accordion defaultExpanded={true} >
      
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}>
        <Typography> {title} </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ 
          display: 'flex',
          width: '100%',
          height: `${height}px`}}>
            {children}
        </Box> 
      </AccordionDetails>
    </Accordion> 
  )
}

export default AccordionView;