// local styles
import './PointCloudViewer.css';

// react
import { useEffect, useRef, useState } from 'react';
// import { PointCloudViewerController } from './controller/PointCloudViewerController';
import { PointCloudViewerController } from './controller/PointCloudViewerController';

const PointCloudViewer = ( { pointCloudRawData, videoState, recordingMetadata }: any ) => {

  // DOM Refs
  const containerRef = useRef(null);

  // state
  const [pointCloudViewerController, setPointCloudViewerController] = useState<PointCloudViewerController | null>(null);

  // temp
  const [videostarted, setvideostarted ] = useState<boolean>(false);
  const [sessionMetadata, setSessionMetadata] = useState<any>({});

  useEffect( () => {

    if( videoState.playing ){

      const currentGazeindex: number = pointCloudViewerController.timestampManager.get_gaze_timestamp_index( sessionMetadata.firstEntry, videoState.currentTime );
      pointCloudViewerController.play_gaze_animation(currentGazeindex);

    }

  }, [videoState])

  useEffect( () => {

    // clearing previous renderings
    if( containerRef.current.children.length > 0 ){
      containerRef.current.removeChild(containerRef.current.children[0])
    }

    const pointCloudViewerController: PointCloudViewerController = new PointCloudViewerController();
    pointCloudViewerController.initialize_controller( containerRef.current! ).then( () => {
    
      // initializing world point cloud
      pointCloudViewerController.initialize_world_point_cloud_dataset( pointCloudRawData['world'] );

      // initializing gaze point cloud
      pointCloudViewerController.initialize_gaze_point_cloud_dataset( pointCloudRawData['gaze'] );

      // initializing timestamp manager
      pointCloudViewerController.initialize_timestamp_manager();

      // rendering world point cloud
      pointCloudViewerController.render_world_point_cloud();

      // saving instance
      setPointCloudViewerController( pointCloudViewerController );

  });

  }, [pointCloudRawData])

  useEffect( () => {

    if( recordingMetadata ){
      setSessionMetadata({ 'firstEntry': parseInt(recordingMetadata['first-entry'].split('-')[0]) });
    }
    
  }, [recordingMetadata] )
  
  return (
    <div className='component-wrapper'>
      <div className='component-container'>
        <div className='scene-container' ref={containerRef}></div>
      </div>
    </div>
)};

export default PointCloudViewer;
