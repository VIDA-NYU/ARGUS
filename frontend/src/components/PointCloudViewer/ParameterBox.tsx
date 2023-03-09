// react
import React, { useState } from 'react';

// material
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';

// types
import { RenderParameters, RenderStyle } from './types/types';

const ParameterBox = ( props ) => {

    const [selectedParameters, setSelectedParameters] = useState<RenderParameters>({gazepointcloud: true, projectedgazepointcloud: true, worldpointcloud: true});
    // const [selectedStyles, setSelectedStyles] = useState<RenderStyle>();

    const styleChangeHandler = (event: any) => {
        
        const [pointCloudName, attribute] = event.target.name.split(':');
        const value: number = event.target.value;
        const renderStyle: RenderStyle = { pointCloudName, attribute, value };

        // firing event
        props.onStyleChange( renderStyle );

    }

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
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column'}}>

            <Box sx={{ display: 'flex', width: '100%', height: '120px', flexDirection: 'column' }} >
                <Box sx={{ display: 'flex', width: '100%', height: '50px', alignItems: 'center' }}>
                    <Checkbox id='worldpointcloud' onChange={parameterChangeHandler} checked={selectedParameters.worldpointcloud}/>
                    <h4>World points</h4>
                </Box>

                <Box sx={{ display: 'flex', flex: 1, flexDirection:'column' }}>

                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>

                        <Box sx={{ display: 'flex', width: '100px', alignItems: 'center', justifyContent: 'center' }}>
                            <h4>opacity</h4>
                        </Box>
                        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                            <Slider name='worldpointcloud:opacity' onChange={styleChangeHandler} min={0} max={1} step={0.1}/>
                        </Box>

                    </Box>

                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>

                        <Box sx={{ display: 'flex', width: '100px', alignItems: 'center', justifyContent: 'center' }}>
                            <h4>size</h4>
                        </Box>
                        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                            <Slider name='worldpointcloud:size' onChange={styleChangeHandler} min={0} max={0.065} step={0.002}/>
                        </Box>

                    </Box>


                </Box>
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