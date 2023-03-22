// react
import { Box, CircularProgress, Slider } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

// controller
import { SceneViewerController } from './controllers/SceneViewer.controller';
import ParameterBox from './ParameterBox';
import { DataUtils } from './utils/DataUtils';

const SceneViewer = ( {sceneData} : any ) => {

    const [loadingData, setLoadingData] = useState<boolean>(true);

    // DOM Refs
    const containerRef = useRef(null);
    const tooltipContainerRef = useRef(null);

    // controller
    const sceneViewerController = useMemo( () => new SceneViewerController(), []);

    const onModelClassSelected = ( className: string ) => {

        sceneViewerController.remove_scene_objects(['model-voxelcloud']);
        sceneViewerController.dataset.create_model_voxel_cloud(['gazeprojection-pointcloud'], 'perception', className );
        sceneViewerController.update_scene_voxel_clouds();
        
    };

    const onVisibilityChange = ( cloudName: string, visibility: boolean ) => {
        sceneViewerController.change_cloud_visibility( cloudName, visibility );
    };

    const onPointCloudStyleChange = ( cloudName: string, attribute: string, value: number ) => {
        sceneViewerController.change_point_cloud_style( cloudName, attribute, value );
    };

    const onVoxelCloudStyleChange = ( cloudName: string, attribute: string, value: number ) => {
        sceneViewerController.change_voxel_cloud_style( cloudName, attribute, value );
    };

    const onTimestampRangeSelected = (event: Event, newValue: number | number[]) => {

        sceneViewerController.filter_points_by_timestamp( [0 , 100] );

    };

    useEffect(() => {

        if( 'pointCloudData' in sceneData ){

            // clearing scene
            sceneViewerController.scene?.clear_scene();

            // initializing dataset
            sceneViewerController.initialize_dataset( sceneData );
            sceneViewerController.initialize_scene( containerRef.current, tooltipContainerRef.current );
            sceneViewerController.initialize_tooltip( sceneData.videoData );

            // adding clouds to scene
            sceneViewerController.update_scene_point_clouds();
            
            // creating derived data
            sceneViewerController.create_projections();
            sceneViewerController.update_scene_point_clouds();

            // creating world voxel grid
            sceneViewerController.dataset.create_world_voxel_grid();

            // updating voxel clouds
            sceneViewerController.dataset.create_density_voxel_clouds();
            // sceneViewerController.dataset.create_model_voxel_cloud(['gazeprojection-pointcloud'], 'perception');
            
            sceneViewerController.update_scene_voxel_clouds();

            // intializing highlights
            sceneViewerController.scene.initialize_scene_highlight();

            // render
            sceneViewerController.scene.render();

            // removing spinner
            setLoadingData(false);
            
        }

    }, [sceneData])


    const loadingSpinner = () => {
        return (
            <Box sx={{ display: 'flex', width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress/>
            </Box>
        )
    };

    return (
        
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative'}}>


            { (loadingData) ? loadingSpinner(): <></> }

            <div style={{ 
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                position: 'absolute' }}
                ref={containerRef}>
            </div>    

            <div style={{ 
                top: 20,
                left: 20,
                width: '20%',
                height: '20%',
                position: 'absolute'}}
                ref={tooltipContainerRef}>
            </div>

            {/* <div style={{ 
                top: 20,
                left: 'calc(100% - 620px)',
                width: '1000px',
                height: '300px',
                position: 'absolute',
                display: 'flex',
                backgroundColor: 'white'}}>
                    <IMUViewer
                       //type={dataType.JSON} 
                        title={"IMU Data"}
                        data={[sceneData.IMUAccelData, sceneData.IMUGyroData, sceneData.IMUMagData]}
                        recordingName={sceneData.recordingName} 
                        //state={state} 
                        //recordingMetaData={recordingData}
                        >
                    </IMUViewer>
            </div> */}

            <div style={{ 
                top: 'calc(100% - 400px)',
                left: 20,
                width: '400px',
                height: '300px',
                position: 'absolute',
                display: 'flex'}}>
                    <ParameterBox 
                        perceptionLabels={ DataUtils.extract_perception_labels( sceneData.modelData.perception ) }
                        onModelClassSelected={onModelClassSelected}
                        onVisibilityChange={onVisibilityChange}
                        onPointCloudStyleChange={onPointCloudStyleChange}
                        onVoxelCloudStyleChange={onVoxelCloudStyleChange}>    
                    </ParameterBox>
            </div>    

            <div style={{ 
                top: '50px',
                left: '10%',
                width: '80%',
                height: '100px',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center'}}>
                   <Slider
                        onChangeCommitted={onTimestampRangeSelected}
                        min={0}
                        max={200}
                        value={[20, 100]}
                        valueLabelDisplay="auto"/>
            </div>    



        </div>
        
    )};

export default SceneViewer;