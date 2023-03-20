// react
import React, { useEffect, useMemo, useRef } from 'react';
import IMUViewer from '../IMUViewer/IMUViewer';

// controller
import { SceneViewerController } from './controllers/SceneViewer.controller';
import ParameterBox from './ParameterBox';
import { RenderParameters, RenderStyle } from './types/types';

const SceneViewer = ( {sceneData} : any ) => {

    // DOM Refs
    const containerRef = useRef(null);
    const tooltipContainerRef = useRef(null);

    const sceneViewerController = useMemo( () => new SceneViewerController(), []);

    const onVisibilityChange = ( cloudName: string, visibility: boolean ) => {
        sceneViewerController.change_cloud_visibility( cloudName, visibility );
    };

    const onStyleChange = ( cloudName: string, attribute: string, value: number ) => {
        sceneViewerController.change_cloud_style( cloudName, attribute, value );
    }

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
            sceneViewerController.dataset.create_voxel_clouds();
            sceneViewerController.update_scene_voxel_clouds();

            // render
            sceneViewerController.scene.render();
            
        }

    }, [sceneData])

    return (
        
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative'}}>

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
                top: 20,
                left: 20,
                width: '400px',
                height: '300px',
                position: 'absolute',
                display: 'flex'}}>
                    <ParameterBox 
                        onVisibilityChange={onVisibilityChange}
                        onStyleChange={onStyleChange}>    
                    </ParameterBox>
            </div>    

        </div>
        
    )};

export default SceneViewer;