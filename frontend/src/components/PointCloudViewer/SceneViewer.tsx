// react
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TimestampManager from '../../tabs/HistoricalDataView/services/TimestampManager';
import IMUViewer from '../IMUViewer/IMUViewer';

// controller
import { SceneViewerController } from './controllers/SceneViewer.controller';
import ParameterBox from './ParameterBox';
import { RenderParameters, RenderStyle } from './types/types';
import { DataGenUtils } from './utils/DataGenUtils';

const SceneViewer = ( {sceneData} : any ) => {

    // DOM Refs
    const containerRef = useRef(null);
    const tooltipContainerRef = useRef(null);

    // const [sceneViewerController, setSceneViewerController ] = useState<SceneViewerController>( new SceneViewerController() );
    const sceneViewerController = useMemo( () => new SceneViewerController(), []);

    const pointCloudParameterChangeHandler = ( parameters: RenderParameters ) => {

        sceneViewerController.scene.sceneConfiguration.set_render_visibility( parameters );
        
    };

    const pointCloudStyleChangeHandler = ( renderStyle: RenderStyle ) => {

        sceneViewerController.scene.sceneConfiguration.set_render_style( renderStyle )

    }

    useEffect(() => {

        if( 'pointCloudData' in sceneData ){
        
            // clearing scene
            sceneViewerController.scene?.clear_scene();

            // creating new scene
            sceneViewerController.initialize_controller( containerRef.current, tooltipContainerRef.current );
            
        }

        // initializing dataset
        if( 'pointCloudData' in sceneData && 'world' in sceneData.pointCloudData ){    

            // initializing world point cloud data
            sceneViewerController.dataset.initialize_world_pointcloud_dataset( sceneData.pointCloudData['world'] );
            const [worldBufferPositions, worldBufferColors]: [number[], number[]] = sceneViewerController.dataset.worldPointCloud.get_buffer_positions();
            sceneViewerController.scene.add_point_cloud( 'worldpointcloud', worldBufferPositions, worldBufferColors);
            
        }

        if( 'pointCloudData' in sceneData && 'gaze' in sceneData.pointCloudData ){

            sceneViewerController.dataset.initialize_gaze_pointcloud_dataset( sceneData.pointCloudData['gaze'] );
            const [gazeBufferPositions, gazeBufferNormals, gazeTimestamps]: [number[], number[][], number[]] = sceneViewerController.dataset.gazePointCloud.get_buffer_positions();
            sceneViewerController.scene.add_point_cloud('gazepointcloud', gazeBufferPositions, [], gazeBufferNormals, gazeTimestamps);

            // generating gaze projection on the point cloud
            const gazeProjection: number[][] = DataGenUtils.generate_gaze_projection( sceneViewerController.scene, sceneViewerController.dataset.gazePointCloud );
            sceneViewerController.scene.add_point_cloud( 'projectedgazepointcloud', gazeProjection.flat(), [], [], gazeTimestamps);
            
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
            
            <div style={{ 
                top: 20,
                left: 'calc(100% - 620px)',
                width: '600px',
                height: '600px',
                position: 'absolute',
                display: 'flex',
                backgroundColor: 'white'}}>
                    <IMUViewer></IMUViewer>
            </div> 

            <div style={{ 
                top: 20,
                left: 20,
                width: '400px',
                height: '200px',
                position: 'absolute',
                display: 'flex'}}>
                    <ParameterBox 
                        onStyleChange={pointCloudStyleChangeHandler}
                        onParameterChange={pointCloudParameterChangeHandler}>    
                    </ParameterBox>
            </div>    

        </div>
    )};

export default SceneViewer;