// react
import React, { useEffect, useState } from 'react';

// material
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Divider, 
    Typography, 
    Box, 
    Checkbox, 
    Slider,
    Select,
    MenuItem, 
    SelectChangeEvent} from '@mui/material';

// types
const ParameterBox = ( props ) => {

    const [ selectedClass, setSelectedClass ] = React.useState('');

    const pointCloudNames: string[] = [ 'gazeorigin-pointcloud', 'lefthands-pointcloud', 'righthands-pointcloud', 'gazeprojection-pointcloud', 'world-pointcloud' ];
    const voxelCloudNames: string[] = [ 'gazeorigin-voxelcloud', 'lefthands-voxelcloud', 'righthands-voxelcloud', 'gazeprojection-voxelcloud' ];
    const classNames: string[] = ['plate', 'flour tortilla','cutting board', 'paper towel'];

    const visibilityChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onVisibilityChange(event.target.id, event.target.checked)
    }

    const pointCloudStyleChangeHandler = (event: any) => {

        const [cloudName, attribute] = event.target.name.split(':');
        const value: number = event.target.value;

        props.onPointCloudStyleChange( cloudName, attribute, value );
    }

    // const voxelCloudStyleChangeHandler = (event: any) => {

    //     const [cloudName, attribute] = event.target.name.split(':');
    //     const value: number = event.target.value;

    //     console.log(cloudName, ' , ', attribute, ' , ', value)

    //     // props.onStyleChange( cloudName, attribute, value );
    // }

    const handleClassSelection = (event: SelectChangeEvent) => {

        setSelectedClass(event.target.value);
    
    }

    return(
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', opacity: 0.8, border: 'solid', borderWidth: '1px', borderColor: 'rgba(25, 118, 210, 0.5)', position: 'relative'  }}>

            <div style={{ 
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                position: 'absolute',
                overflowY: 'scroll'}}>

                <Accordion>

                    <AccordionSummary>
                        <Typography color={'#1976d2'}>Visibility (points)</Typography>
                    </AccordionSummary>

                    <AccordionDetails>

                        <Box sx={{ display: 'flex', width: '100%', height: '300px', flexDirection: 'column' }} >

                        { pointCloudNames.map( ( pointCloudName: string ) => (
                            <Box key={pointCloudName} sx={{ display: 'flex', width: '100%', height: '50px', alignItems: 'center' }}>
                                <Checkbox id={pointCloudName} onChange={visibilityChangeHandler} defaultChecked />
                                <Typography>
                                    {pointCloudName}
                                </Typography>
                                <Divider></Divider>
                            </Box>
                        ))}

                        </Box>

                    </AccordionDetails>

                </Accordion>

                <Accordion>

                    <AccordionSummary>
                        <Typography color={'#1976d2'}>Visibility (heatmaps)</Typography>
                    </AccordionSummary>

                    <AccordionDetails>

                        <Box sx={{ display: 'flex', width: '100%', height: '300px', flexDirection: 'column' }} >

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
                        <Typography color={'#1976d2'}>Point sizes</Typography>
                    </AccordionSummary>

                    <AccordionDetails>

                        <Box sx={{ display: 'flex', width: '100%', height: '350px', flexDirection: 'column' }} >

                            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>

                                <Box sx={{ display: 'flex', width: '95%', height: '70px', flexDirection: 'column', alignItems: 'center' }}> 

                                    <Typography>
                                        World points:
                                    </Typography>

                                    <Box sx={{ width: '80%', height: '70px'}} >
                                        <Slider name='world-pointcloud:size' onChange={pointCloudStyleChangeHandler} min={0} max={0.065} step={0.002}/>
                                    </Box>

                                </Box>

                                <Box sx={{ display: 'flex', width: '95%', height: '70px', flexDirection: 'column', alignItems: 'center' }}> 

                                    <Typography>
                                        Gaze Origin:
                                    </Typography>

                                    <Box sx={{ width: '80%', height: '70px'}} >
                                        <Slider name='gazeorigin-pointcloud:size' onChange={pointCloudStyleChangeHandler} min={0} max={0.065} step={0.002}/>
                                    </Box>

                                </Box>


                                <Box sx={{ display: 'flex', width: '95%', height: '70px', flexDirection: 'column', alignItems: 'center' }}> 

                                    <Typography>
                                        Gaze Projection:
                                    </Typography>

                                    <Box sx={{ width: '80%', height: '70px'}} >
                                        <Slider name='gazeprojection-pointcloud:size' onChange={pointCloudStyleChangeHandler} min={0} max={0.065} step={0.002}/>
                                    </Box>

                                </Box>

                                <Box sx={{ display: 'flex', width: '95%', height: '70px', flexDirection: 'column', alignItems: 'center' }}> 

                                    <Typography>
                                        Left Hand:
                                    </Typography>

                                    <Box sx={{ width: '80%', height: '70px'}} >
                                        <Slider name='lefthands-pointcloud:size' onChange={pointCloudStyleChangeHandler} min={0} max={0.065} step={0.002}/>
                                    </Box>

                                </Box>

                                <Box sx={{ display: 'flex', width: '95%', height: '70px', flexDirection: 'column', alignItems: 'center' }}> 

                                    <Typography>
                                        Right Hand:
                                    </Typography>

                                    <Box sx={{ width: '80%', height: '70px'}} >
                                        <Slider name='righthands-pointcloud:size' onChange={pointCloudStyleChangeHandler} min={0} max={0.065} step={0.002}/>
                                    </Box>

                                </Box>

                            </Box>

                        </Box>

                    </AccordionDetails>

                </Accordion>

                <Accordion>

                    <AccordionSummary>
                        <Typography color={'#1976d2'}>Model Heatmap</Typography>
                    </AccordionSummary>

                    <AccordionDetails>

                        <Box sx={{ display: 'flex', width: '100%', height: '350px', flexDirection: 'column' }} >

                            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>

                                <Typography>
                                    Class Name:
                                </Typography>

                                <Select
                                    labelId="perception-classes"
                                    id="perception-classes"
                                    value={selectedClass}
                                    onChange={handleClassSelection}
                                    label="Class">
                                        { classNames.map( (className: string) => <MenuItem key={className} value={className}>{className}</MenuItem> )}
                                </Select>

                            </Box>

                        </Box>

                    </AccordionDetails>

                </Accordion>

            </div>   

        </Box>
    )
}

export default ParameterBox;