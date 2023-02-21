// react
import React, { useEffect, useRef, useState } from 'react';

// controller
import { SceneViewerController } from './controllers/SceneViewer.controller';

const SceneViewer = ( {pointCloudData} : any ) => {

    // DOM Refs
    const containerRef = useRef(null);

    // Controller
    const sceneViewerController = new SceneViewerController();

    useEffect(() => {
        sceneViewerController.initialize_controller( containerRef.current );
    }, []);

    useEffect(() => {
        
        // initializing dataset
        if( 'world' in pointCloudData ){    
            
            // initializing world point cloud data
            sceneViewerController.dataset.initialize_world_pointcloud_dataset( pointCloudData['world'] );
            const [worldBufferPositions, worldBufferColors]: [number[], number[]] = sceneViewerController.dataset.worldPointCloud.get_buffer_positions();
            sceneViewerController.scene.add_point_cloud( 'worldpointcloud', worldBufferPositions, worldBufferColors);
            
        }

        if( 'gaze' in pointCloudData ){

            sceneViewerController.dataset.initialize_gaze_pointcloud_dataset( pointCloudData['gaze'] );
            const [gazeBufferPositions, gazeBufferNormals]: [number[], number[]] = sceneViewerController.dataset.gazePointCloud.get_buffer_positions();
            sceneViewerController.scene.add_point_cloud('gazepointcloud', gazeBufferPositions, [], gazeBufferNormals);            

        }

    }, [pointCloudData])

    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative', 
            zIndex: 1, 
            display: 'inline-block' }} 
            ref={containerRef}>
        </div>
    )
};

export default SceneViewer;