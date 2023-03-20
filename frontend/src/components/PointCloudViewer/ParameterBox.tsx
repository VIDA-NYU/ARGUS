// react
import React, { useEffect, useState } from 'react';

// material
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';

// types
import { RenderParameters, RenderStyle } from './types/types';

const ParameterBox = ( props ) => {

    const pointCloudNames: string[] = [ 'gazeorigin-pointcloud', 'lefthands-pointcloud', 'righthands-pointcloud', 'world-pointcloud' ];
    const voxelCloudNames: string[] = [ 'gazeorigin-voxelcloud', 'lefthands-voxelcloud', 'righthands-voxelcloud' ];

    const visibilityChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onVisibilityChange(event.target.id, event.target.checked)
    }

    const styleChangeHandler = (event: any) => {

        const [cloudName, attribute] = event.target.name.split(':');
        const value: number = event.target.value;

        props.onStyleChange( cloudName, attribute, value );
    }

    return(
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#3f50b5', opacity: 0.8, border: 'solid', borderColor: '#002884', position: 'relative'  }}>

            <div style={{ 
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                position: 'absolute',
                overflowY: 'scroll'}}>

                <Accordion>

                    <AccordionSummary>
                        <Typography>Visibility</Typography>
                    </AccordionSummary>

                    <AccordionDetails>

                        <Box sx={{ display: 'flex', width: '100%', height: '400px', flexDirection: 'column' }} >

                        { pointCloudNames.map( ( pointCloudName: string ) => (
                            <Box key={pointCloudName} sx={{ display: 'flex', width: '100%', height: '50px', alignItems: 'center' }}>
                                <Checkbox id={pointCloudName} onChange={visibilityChangeHandler} defaultChecked />
                                <Typography>
                                    {pointCloudName}
                                </Typography>
                                <Divider></Divider>
                            </Box>
                        ))}

                        { voxelCloudNames.map( ( voxelCloudName: string ) => (
                            <Box key={voxelCloudName} sx={{ display: 'flex', width: '100%', height: '50px', alignItems: 'center' }}>
                                <Checkbox id={voxelCloudName} onChange={visibilityChangeHandler} defaultChecked />
                                <Typography>
                                    {voxelCloudName}
                                </Typography>
                            </Box>
                        ))} 

                        </Box>

                    </AccordionDetails>

                </Accordion>


                <Accordion>

                    <AccordionSummary>
                        <Typography>Styles</Typography>
                    </AccordionSummary>

                    <AccordionDetails>

                        <Box sx={{ display: 'flex', width: '100%', height: '250px', flexDirection: 'column' }} >

                            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>

                                <Box sx={{ display: 'flex', width: '100%', height: '70px', flexDirection: 'column' }}> 

                                    <Typography>
                                        Size:
                                    </Typography>
                                    <Slider name='world-pointcloud:size' onChange={styleChangeHandler} min={0} max={0.065} step={0.002}/>
                                </Box>
                                
                                {/* <Box sx={{ display: 'flex', width: '100px', alignItems: 'center', justifyContent: 'center' }}>
                                    <h4>size</h4>
                                </Box>
                                <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                                    <Slider name='world-pointcloud:size' onChange={styleChangeHandler} min={0} max={0.065} step={0.002}/>
                                </Box> */}

                            </Box>

                        </Box>

                    </AccordionDetails>

                </Accordion>

            </div>   



            {/* <Box sx={{ display: 'flex', width: '100%', height: '120px', flexDirection: 'column' }} >




                <Box sx={{ display: 'flex', flex: 1, flexDirection:'column' }}>

                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>

                        <Box sx={{ display: 'flex', width: '100px', alignItems: 'center', justifyContent: 'center' }}>
                            <h4>size</h4>
                        </Box>
                        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                            <Slider name='worldpointcloud:size' onChange={styleChangeHandler} min={0} max={0.065} step={0.002}/>
                        </Box>

                    </Box>

                </Box>

                <Divider />
                
            </Box> */}

        </Box>
    )
}

export default ParameterBox;