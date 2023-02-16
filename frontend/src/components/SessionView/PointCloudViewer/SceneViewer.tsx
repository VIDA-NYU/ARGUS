// react
import React, { useEffect, useRef, useState } from 'react';
import { SceneViewerController } from './controllers/SceneViewer.controller';

const SceneViewer = ( {pointCloudData} : any ) => {

    // DOM Refs
    const containerRef = useRef(null);

    // state
    const [sceneViewerController, setSceneViewerController] = useState<SceneViewerController | null>(null);

    useEffect(() => {



    }, [pointCloudData])

    return (
        <div style={{ flex: 1 }} ref={containerRef}></div>
    )

};

export default SceneViewer;