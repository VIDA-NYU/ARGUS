// react
import React, { useEffect, useRef, useState } from 'react';
import { PointCloudViewerController } from './controllers/PointCloudViewer.controller';

const SceneViewer = ( {pointCloudData} : any ) => {

    // DOM Refs
    const containerRef = useRef(null);

    // state
    const [pointCloudViewerController, setPointCloudViewerController] = useState<PointCloudViewerController | null>(null);

    useEffect(() => {

        const pointCloudViewerController: PointCloudViewerController = new PointCloudViewerController();
        pointCloudViewerController.initialize_controller( containerRef.current );

    }, [pointCloudData])

    return (
        <div style={{ flex: 1 }} ref={containerRef}></div>
    )

};

export default SceneViewer;