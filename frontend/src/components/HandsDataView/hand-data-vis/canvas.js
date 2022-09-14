import * as THREE from 'three'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Mask, useMask, OrthographicCamera, Clone, Float as FloatImpl } from '@react-three/drei'
import useSpline from '@splinetool/r3f-spline'
import {styled} from "@mui/material";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber';
import { Box, OrbitControls, Sky } from '@react-three/drei'
import HandsModel from "./hands";


const ContentContainer = styled("div")({
    width: 420,
    height: 200,
    position: "relative",
    top: 0,
    left: 0,
})

export function HandsCanvas(props) {
    const container = useRef()
    const domContent = useRef();

    let zoomRate = 1000;
    if(props.variant === "overview"){
        zoomRate = 120;
    }

    return (
        <ContentContainer ref={container} className="content-container">
            {/* Container for the HTML view */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }} ref={domContent} />
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
                    state.events.connect(container.current)
                    // Re-define the event-compute function which now uses pageX/Y instead of offsetX/Y
                    // Without this the right hand would reset to client 0/0 if it hovers over any of the HTML elements
                    state.setEvents({
                        compute: (event, state) => {
                            state.pointer.set((event.pageX / state.size.width) * 2 - 1, -(event.pageY / state.size.height) * 2 + 1)
                            state.raycaster.setFromCamera(state.pointer, state.camera)
                        },
                    })
                }}>
                <directionalLight castShadow intensity={0.4} position={[-1, 5, 3]} shadow-mapSize={[512, 512]} shadow-bias={-0.002}>
                    <orthographicCamera attach="shadow-camera" zoom={100000} args={[-2, 2, 2, -2, -10, 10]} />
                </directionalLight>
                <OrthographicCamera zoom={zoomRate} makeDefault={true} far={10} near={-10} position={[0, 0, 0.01]} />
                <hemisphereLight intensity={0.5} color="#eaeaea" position={[0, 1, 0]} />
                <OrbitControls />
                <primitive object={new THREE.AxesHelper(1)} />
                <HandsModel state={props.state} variant={props.variant} data={props.data}></HandsModel>
                {/*<FaceModel data={props.data} position={[0, 0, -10]}> </FaceModel>*/}
            </Canvas>
        </ContentContainer>
    )
}