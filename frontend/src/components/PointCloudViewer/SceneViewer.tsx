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
            sceneViewerController.add_point_clouds_to_scene();
            sceneViewerController.add_voxel_clouds_to_scene();

            // creating derived data
            sceneViewerController.create_projections();
            sceneViewerController.add_point_clouds_to_scene();

            // render
            sceneViewerController.scene.render();
            
        }

        // // initializing dataset
        // if( 'pointCloudData' in sceneData && 'world' in sceneData.pointCloudData ){    

        //     // initializing world point cloud data
        //     sceneViewerController.dataset.initialize_world_pointcloud_dataset( sceneData.pointCloudData['world'] );
        //     const worldPointCloud: WorldPointCloud = sceneViewerController.dataset.worldPointCloud;
            

        //     // adding layer to scene and saving ref
        //     worldPointCloud.add_to_scene( sceneViewerController.scene.scene );
        //     sceneViewerController.scene.save_layer( 'worldpointcloud', worldPointCloud );

        // }
        
        // if( 'pointCloudData' in sceneData && 'gaze' in sceneData.pointCloudData ){

        //     sceneViewerController.dataset.initialize_gaze_pointcloud_dataset( sceneData.pointCloudData['gaze'] );
        //     const gazePointCloud: GazePointCloud = sceneViewerController.dataset.gazePointCloud;
            
        //     // adding layer to scene and saving ref
        //     gazePointCloud.add_to_scene( sceneViewerController.scene.scene );
        //     sceneViewerController.scene.save_layer( 'gazepointcloud', gazePointCloud );

        //     // generating gaze points
        //     const gazeProjection: GazeProjection = gazePointCloud.generate_gaze_world_projection( sceneViewerController.scene );
        //     sceneViewerController.scene.save_layer('projectedgazepointcloud',  gazeProjection );

            

        //     // calculating gaze heatmap
        //     // const worldVoxelGrid: WorldVoxelGrid = sceneViewerController.dataset.worldPointCloud.voxelGrid;
        //     // gazePointCloud.generate_gaze_heatmap( worldVoxelGrid, sceneViewerController.scene.scene );

        //     // const [gazeBufferPositions, gazeBufferNormals, gazeTimestamps]: [number[], number[][], number[]] = sceneViewerController.dataset.gazePointCloud.get_buffer_positions();
        //     // sceneViewerController.scene.add_point_cloud('gazepointcloud', gazeBufferPositions, [], gazeBufferNormals, gazeTimestamps);

        //     // // generating gaze projection on the point cloud
        //     // const gazeProjection: number[][] = DataGenUtils.generate_gaze_projection( sceneViewerController.scene, sceneViewerController.dataset.gazePointCloud );
        //     // sceneViewerController.scene.add_point_cloud( 'projectedgazepointcloud', gazeProjection.flat(), [], [], gazeTimestamps);
            
        // }

        // if( 'pointCloudData' in sceneData && 'hand' in sceneData.pointCloudData ){

        //     sceneViewerController.dataset.initialize_hand_pointcloud_dataset( sceneData.pointCloudData['hand'] );

        // }

        // if( 'videoData' in sceneData ){

        //     sceneViewerController.initialize_tooltip( sceneData.videoData );

        // }

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

            <div style={{ 
                top: 20,
                left: 'calc(100% - 620px)',
                width: '1000px',
                height: '300px',
                position: 'absolute',
                display: 'flex',
                backgroundColor: 'white'}}>
                    {/*<IMUViewer
                       //type={dataType.JSON} 
                        title={"IMU Data"}
                        data={[sceneData.IMUAccelData, sceneData.IMUGyroData, sceneData.IMUMagData]}
                        recordingName={sceneData.recordingName} 
                        //state={state} 
                        //recordingMetaData={recordingData}
                        >
            </IMUViewer>*/}
            </div>

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