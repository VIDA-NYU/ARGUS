// react
import React, { useEffect, useRef, useState } from 'react';
import TimestampManager from '../../tabs/HistoricalDataView/services/TimestampManager';

// controller
import { SceneViewerController } from './controllers/SceneViewer.controller';

const SceneViewer = ( {sceneData} : any ) => {

    // DOM Refs
    const containerRef = useRef(null);
    const tooltipContainerRef = useRef(null);

    // Controller
    const sceneViewerController = new SceneViewerController();

    useEffect(() => {
        sceneViewerController.initialize_controller( containerRef.current, tooltipContainerRef.current );
    }, []);

    useEffect(() => {
        
        // initializing dataset
        if( 'pointCloudData' in sceneData && 'world' in sceneData.pointCloudData ){    
            
            // initializing world point cloud data
            sceneViewerController.dataset.initialize_world_pointcloud_dataset( sceneData.pointCloudData['world'] );
            const [worldBufferPositions, worldBufferColors]: [number[], number[]] = sceneViewerController.dataset.worldPointCloud.get_buffer_positions();
            sceneViewerController.scene.add_point_cloud( 'worldpointcloud', worldBufferPositions, worldBufferColors);
            
        }

        if( 'pointCloudData' in sceneData && 'gaze' in sceneData.pointCloudData ){

            sceneViewerController.dataset.initialize_gaze_pointcloud_dataset( sceneData.pointCloudData['gaze'] );
            const [gazeBufferPositions, gazeBufferNormals, gazeTimestamps]: [number[], number[], number[]] = sceneViewerController.dataset.gazePointCloud.get_buffer_positions();
            sceneViewerController.scene.add_point_cloud('gazepointcloud', gazeBufferPositions, [], gazeBufferNormals, gazeTimestamps);            

        }

        if( 'videoData' in sceneData ){
            sceneViewerController.initialize_tooltip( sceneData.videoData );
        }

    }, [sceneData])

    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative'
        }}>

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

        </div>
    )};

export default SceneViewer;