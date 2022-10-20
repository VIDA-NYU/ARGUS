import * as THREE from 'three'
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Canvas, extend, useFrame, useThree} from '@react-three/fiber'
import { Html, Mask, useMask, OrthographicCamera, Clone, Float as FloatImpl } from '@react-three/drei'
import useSpline from '@splinetool/r3f-spline'
import {styled} from "@mui/material";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber';
import FaceModel from "./face";
import { Box, Sky, OrbitControls } from '@react-three/drei'
import data from "bootstrap/js/src/dom/data";
import MemoryObjects from "./scatter/scatter-objects";
import BoundingBoxEnvironment from "./environment/environment";
import {addVector3D} from "./utils/utils";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Text } from "troika-three-text";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import fontFile from "./text/Open_Sans_Regular.json";
extend({ TextGeometry })
extend({ Text });
const font = new FontLoader().parse(fontFile);


const ContentContainer = styled("div")({
    width: 500,
    marginRight: 120,
    height: 200,
    // paddingTop: 100
})

const CameraController = () => {
    const { camera, gl } = useThree();
    camera.position.set(1000, 0, 4500);
    // camera.zoom.set(0.1);
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            controls.minDistance = 100;
            controls.maxDistance = 5000;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};

export function MemoryCanvas(props) {
    const container = useRef()
    const domContent = useRef();

    const MemoOrbits = React.memo(OrbitControls);

    return (
        <ContentContainer ref={container} className="content-container">
            {/* Container for the HTML view */}
            <div style={{ position: 'absolute', top: 120, left: 0, width: "80%", height: '600px', overflow: 'hidden' }} ref={domContent} />
            {/* Container for THREEJS */}
            <Canvas
                shadows
                flat
                linear
                // Since the canvas will receive events from the out-most container it must ignore events
                // This will allow the HTML view underneath to receive events, too
                style={{ pointerEvents: 'none' }}
                onCreated={(state) => {
                    // Re-connect r3f to a shared container, this allows both worlds (html & canvas) to receive events
                    state.events.connect(domContent.current)
                    // Re-define the event-compute function which now uses pageX/Y instead of offsetX/Y
                    // Without this the right hand would reset to client 0/0 if it hovers over any of the HTML elements
                    state.setEvents({
                        compute: (event, state) => {
                            state.pointer.set((event.pageX / state.size.width) * 2 - 1, -(event.pageY / state.size.height) * 2 + 1)
                            state.raycaster.setFromCamera(state.pointer, state.camera)
                        },
                    })
                }}>
                <directionalLight castShadow intensity={0.4} position={[-10, 50, 300]} shadow-mapSize={[512, 512]} shadow-bias={-0.002}>
                    <orthographicCamera attach="shadow-camera" args={[-2000, 2000, 2000, -2000, -10000, 10000]} />
                </directionalLight>
                <OrthographicCamera makeDefault={true} far={10000000} near={-1000000} position={[-1000, 1000, 1000]} zoom={0.1} />
                <hemisphereLight intensity={0.5} color="#eaeaea" position={[0, 1, 0]} />
                {/*<OrbitControls/>*/}
                <MemoOrbits></MemoOrbits>
                <primitive object={new THREE.AxesHelper(1000)} />
                <BoundingBoxEnvironment></BoundingBoxEnvironment>
                <FaceModel  position={[0, 0, 0]} gazeInfo={props.gazeInfo}> </FaceModel>
                <MemoryObjects showingLabel={props.showingLabel} memoryObjects={props.memoryObjects}></MemoryObjects>
            </Canvas>
            {/*<Canvas>*/}
            {/*    <CameraController />*/}
            {/*    <ambientLight />*/}
            {/*    <spotLight intensity={1.0} position={[5, 10, 50]} />*/}
            {/*    <primitive object={new THREE.AxesHelper(4000)} />*/}
            {/*        <BoundingBoxEnvironment></BoundingBoxEnvironment>*/}
            {/*        /!*<FaceModel  position={[0, 0, 0]} gazeInfo={props.gazeInfo}> </FaceModel>*!/*/}
            {/*        /!*<MemoryObjects memoryObjects={props.memoryObjects}></MemoryObjects>*!/*/}
            {/*</Canvas>*/}
        </ContentContainer>
    )
}