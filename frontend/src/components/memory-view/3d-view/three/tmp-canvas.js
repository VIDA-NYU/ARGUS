import * as THREE from 'three'
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Mask, useMask, OrthographicCamera, Clone, Float as FloatImpl } from '@react-three/drei'
import useSpline from '@splinetool/r3f-spline'
import {styled} from "@mui/material";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber';
import FaceModel from "./face";
import { Box, Sky } from '@react-three/drei'
import data from "bootstrap/js/src/dom/data";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


const ContentContainer = styled("div")({
    width: 600,
    height: 200,
})

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            controls.minDistance = 3;
            controls.maxDistance = 20;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};


function EyeCanvas(props) {
    const container = useRef()
    const domContent = useRef();
    return (
        <ContentContainer ref={container} className="content-container">
            {/* Container for the HTML view */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 800, height: '100%', overflow: 'hidden' }} ref={domContent} />
            {/* Container for THREEJS */}
            <Canvas>
                <CameraController />
                <ambientLight />
                <spotLight intensity={0.3} position={[5, 10, 50]} />
                <primitive object={new THREE.AxesHelper(10)} />
                <mesh>
                    <boxGeometry attach="geometry" args={[3, 2, 1]} />
                    <meshPhongMaterial attach="material" color="hotpink" />
                </mesh>
            </Canvas>
        </ContentContainer>
    )
}
export default EyeCanvas
// export default React.memo(EyeCanvas, (prevProps, nextProps) => true)