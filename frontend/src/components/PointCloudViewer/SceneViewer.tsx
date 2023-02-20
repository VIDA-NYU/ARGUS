// react
import React, { useEffect, useRef, useState } from 'react';
import { SceneViewerController } from './controllers/SceneViewer.controller';

const SceneViewer = ( {pointCloudData} : any ) => {

    // DOM Refs
    const containerRef = useRef(null);

    // state
    const [sceneViewerController, setSceneViewerController] = useState<SceneViewerController | null>(null);

    useEffect(() => {

        // creating controller instance
        const sceneViewerController: SceneViewerController = new SceneViewerController();
        sceneViewerController.initialize_controller( containerRef.current );
                
        // saving controller instance
        setSceneViewerController(sceneViewerController);

    }, []);

    useEffect(() => {

        // initializing dataset
        if( 'world' in pointCloudData ){

            // initializing world point cloud data
            sceneViewerController.dataset.initialize_world_pointcloud_dataset( pointCloudData['world'] );
            const [worldBufferPositions, worldBufferColors]: [number[], number[]] = sceneViewerController.dataset.worldPointCloud.get_buffer_positions();
            sceneViewerController.scene.add__point_cloud( worldBufferPositions, worldBufferColors);
            
        }

    }, [pointCloudData])

    return (
        <div style={{ flex: 1 }} ref={containerRef}></div>
    )
};

export default SceneViewer;