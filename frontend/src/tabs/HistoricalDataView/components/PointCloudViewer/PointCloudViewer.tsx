// local styles
import './PointCloudViewer.css';

// react
import { useEffect, useRef, useState } from 'react';
// import { PointCloudViewerController } from './controller/PointCloudViewerController';
import { PointCloudViewerController } from './controller/PointCloudViewerController';

const PointCloudViewer = ( { worldPointCloudData, eyeData }: any ) => {

  // DOM Refs
  const containerRef = useRef(null);

  // state
  const [pointCloudViewerController, setPointCloudViewerController] = useState<PointCloudViewerController | null>(null);

  // // called on first render
  // useEffect(() => {

  //   console.log(worldPointCloudData);
  //   // const pointCloudViewerController: PointCloudViewerController = new PointCloudViewerController();
  //   // pointCloudViewerController.initialize_controller( containerRef.current! );
  //   // setPointCloudViewerController( pointCloudViewerController );

  // }, [] );

  useEffect(() => {

    const pointCloudViewerController: PointCloudViewerController = new PointCloudViewerController();
    pointCloudViewerController.initialize_controller( containerRef.current!, worldPointCloudData );
    setPointCloudViewerController( pointCloudViewerController );

  }, [worldPointCloudData] );
  
  return (
    <div className='component-wrapper'>
      <div className='component-container'>
        <div className='scene-container' ref={containerRef}></div>
      </div>
    </div>
)};

export default PointCloudViewer;
