// react
import { useEffect, useMemo, useRef, useState } from 'react';

// material
import { Box, CircularProgress, Slider } from '@mui/material';

// controller
import { SceneViewerController } from './controllers/SceneViewer.controller';

// views
import ParameterBox from './ParameterBox';
import TimestampRangeSelector from './TimestampRangeSelector';

// utils
import { DataUtils } from './utils/DataUtils';

const SceneViewer = ( {sceneData} : any ) => {

    const debug: boolean = false;

    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [sessionDuration, setSessionDuration] = useState<number[]>([]);

    // DOM Refs
    const containerRef = useRef(null);
    const tooltipContainerRef = useRef(null);

    // controller
    const sceneViewerController = useMemo( () => new SceneViewerController(), []);

    const onModelClassSelected = ( className: string ) => {

        sceneViewerController.remove_scene_objects(['object-pointcloud']);
        sceneViewerController.dataset.create_object_point_cloud( 'object-pointcloud', className );
        sceneViewerController.update_scene_point_clouds();

        // sceneViewerController.remove_scene_objects(['model-voxelcloud']);
        // sceneViewerController.dataset.create_model_voxel_cloud(['gazeprojection-pointcloud'], 'perception', className );
        // sceneViewerController.update_scene_voxel_clouds();
        
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

    const onTimestampRangeSelected = ( timestampRange: number[] ) => {
        sceneViewerController.filter_points_by_timestamp( timestampRange );
    };

    useEffect(() => {

        if( 'pointCloudData' in sceneData ){

            // try{

                // clearing scene
                sceneViewerController.scene?.clear_scene();

                // initializing dataset
                debug && console.log('Loading point clouds');
                sceneViewerController.initialize_dataset( sceneData );
                sceneViewerController.initialize_scene( containerRef.current, tooltipContainerRef.current );
                sceneViewerController.initialize_tooltip( sceneData.videoData );

                // adding clouds to scene
                debug && console.log('Rendering point clouds');
                sceneViewerController.update_scene_point_clouds();
                
                // creating derived data
                debug && console.log('Creating projections');
                sceneViewerController.create_projections();
                sceneViewerController.update_scene_point_clouds();

                // creating world voxel grid
                debug && console.log('Creating Voxel Grid');
                sceneViewerController.dataset.create_world_voxel_grid();

                // updating voxel clouds
                debug && console.log('Creating density clouds');
                sceneViewerController.dataset.create_density_voxel_clouds();
                // sceneViewerController.dataset.create_model_voxel_cloud(['gazeprojection-pointcloud'], 'perception');
                sceneViewerController.update_scene_voxel_clouds();

                // creating line clouds
                debug && console.log('Creating line clouds');
                sceneViewerController.dataset.create_line_clouds();
                sceneViewerController.update_scene_line_clouds();

                // getting scene duration
                const sessionDuration: number[] = sceneViewerController.dataset.get_session_timestamp_range();
                setSessionDuration(sessionDuration);

                // render
                sceneViewerController.scene.render();

                // removing spinner
                setLoadingData(false);


            // } catch( exception ) {

            //     // removing spinner
            //     setLoadingData(false);

            //     console.log('Point cloud loading failed');
            // }
            
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
                    <TimestampRangeSelector 
                    onTimestampRangeCommited={onTimestampRangeSelected}
                    timestampRange={ sessionDuration } />
            </div>    

        </div>
        
    )};

export default SceneViewer;