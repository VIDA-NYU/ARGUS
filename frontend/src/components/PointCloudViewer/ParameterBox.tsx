// react
import React, { useState } from 'react';

// material
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { RenderParameters } from './types/types';

const ParameterBox = ( props ) => {

    const [selectedParameters, setSelectedParameters] = useState<RenderParameters>({gazepointcloud: true, projectedgazepointcloud: true, worldpointcloud: true});

    const parameterChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        setSelectedParameters( (previousState: RenderParameters) => {

            // setting new state
            const currentState: RenderParameters = {...previousState};
            currentState[event.target.id] = event.target.checked;

            // firing event
            props.onParameterChange(currentState);
            
            return currentState;
        });    
    
    }

    return(
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'gray'}}>

            <Box>
                
            </Box>



            {/* <Box sx={{ display: 'flex', width: '100%', height: '50px' }}>
                <Checkbox id='gazepointcloud' onChange={parameterChangeHandler} checked={selectedParameters.gazepointcloud}/>
                <p>User position</p>
                TODO: Change to typography
            </Box>   */}
            {/* <Box sx={{ display: 'flex', width: '100%', height: '50px' }}>
                <Checkbox id='projectedgazepointcloud' onChange={parameterChangeHandler} checked={selectedParameters.projectedgazepointcloud}/>
                <p>Gaze heatmap</p>
                TODO: Change to typography
            </Box> */}
            {/* <Box sx={{ display: 'flex', width: '100%', height: '50px' }}>
                <Checkbox id='worldpointcloud' onChange={parameterChangeHandler} checked={selectedParameters.worldpointcloud}/>
                <p>World points</p>
                TODO: Change to typography
            </Box> */}




        </Box>
    )
}

export default ParameterBox;