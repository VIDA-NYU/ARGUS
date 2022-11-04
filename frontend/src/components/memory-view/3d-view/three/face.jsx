import React, {Suspense, useEffect, useRef} from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import {useGLTF, useTexture, useAnimations, Stage} from "@react-three/drei"
import { a, useSpring } from "@react-spring/three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from "three";

import {Model} from "./head/Scarlett_johansson_3d_headface";
import GazeLine from "./gaze/gaze-line";
import {multiplyVector3D} from "./utils/utils";
import gazeLine from "./gaze/gaze-line";

function calcAngle(adjacent, hypotenuse) {
    return Math.acos(adjacent / hypotenuse);
}

function computeRotationAngle(gazeDirection){
    let hypotenuse = Math.sqrt(Math.pow(gazeDirection[2], 2) + Math.pow(gazeDirection[0],2));
    let angle = calcAngle(gazeDirection[2], hypotenuse);
    let sinAngle = Math.asin(gazeDirection[0] / hypotenuse);
    if(sinAngle > 0){
        return -angle
    }else{
        return angle
    }
}

function FaceModel(props) {

    let facePosition = [0, 0, 0];

    const groupRef = useRef(null);
    const faceRef = useRef(null);

    if(props.gazeInfo !== {}){
        facePosition = multiplyVector3D(1000, props.gazeInfo.gazeOrigin);
    }

    useFrame((state) => {

        // faceRef.current.position = multiplyVector3D(1000, props.gazeInfo.gazeOrigin);
        // let gazeDirection = processGazeDirection(gazeInfo.gazeDirection);
        // ref.current.geometry.setFromPoints([new THREE.Vector3(RIGHT_EYE_OFFSET_X, RIGHT_EYE_OFFSET_Y, RIGHT_EYE_OFFSET_Z), new THREE.Vector3(RIGHT_EYE_OFFSET_X + gazeDirection.x, RIGHT_EYE_OFFSET_Y + gazeDirection.y, RIGHT_EYE_OFFSET_Z + gazeDirection.z)])
    })

    const rotationMultiplier = 1 * Math.PI ;

    useEffect(() => {
        let newCoordinate = multiplyVector3D(300, props.gazeInfo.gazeOrigin);
        groupRef.current.position.x = newCoordinate[0];
        groupRef.current.position.y = newCoordinate[1];
        groupRef.current.position.z = newCoordinate[2];

        let rotationAngle = computeRotationAngle(props.gazeInfo.gazeDirection);
        // faceRef.current.rotation.x = 0 // rotationMultiplier * props.gazeInfo.gazeDirection[0];
        faceRef.current.rotation.y = Math.PI + rotationMultiplier * props.gazeInfo.gazeDirection[1];
        faceRef.current.rotation.y = Math.PI - rotationAngle;
        // faceRef.current.rotation.z = 0 // rotationMultiplier * props.gazeInfo.gazeDirection[2];
        // faceRef.current.position = multiplyVector3D(1000, props.gazeInfo.gazeOrigin);
    }, [props.gazeInfo])

    return (
        <group ref={groupRef}

               position={[0, 0, 0]}>
            <group
                ref={faceRef}
                rotation-x={Math.PI * 0} rotation-y={1 * Math.PI }
                rotation-z={Math.PI * 0}
            >
                <Model
                ></Model>
            </group>

            { props.gazeInfo !== {} && <GazeLine gazeInfo={props.gazeInfo}></GazeLine>}
        </group>
    )


}

export default FaceModel;
