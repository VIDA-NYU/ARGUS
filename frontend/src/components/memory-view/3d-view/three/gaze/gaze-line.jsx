import React, {useRef} from "react";
import * as THREE from "three";

import {useFrame} from "@react-three/fiber";
import { useSpring, animated as a } from '@react-spring/three'


const LEFT_EYE_OFFSET_X = -40;
const LEFT_EYE_OFFSET_Y = 30;
const RIGHT_EYE_OFFSET_X = 40;
const RIGHT_EYE_OFFSET_Y = 30;
const RIGHT_EYE_OFFSET_Z = 50;
const LEFT_EYE_OFFSET_Z = 112;

function processGazeDirection(direction){
    const baseLength = 1000;
    return {
        x: -direction[0] * baseLength,
        y: direction[1] * baseLength,
        z: -direction[2] * baseLength
    };
}

function getPlayedIndex(played, seqLen){

    if(played < 1){
        return Math.floor(played * seqLen);
    }else{
        return  seqLen - 1;
    }
}

function GazeLine(props){

    const ref = useRef(null);
    const refGazeOrigin = useRef(null);


    const points = []

    points.push(new THREE.Vector3(100, 0, 0))
    points.push(new THREE.Vector3(RIGHT_EYE_OFFSET_X, RIGHT_EYE_OFFSET_Y, RIGHT_EYE_OFFSET_Z))
    const gazeInfo = props.gazeInfo;

    useFrame((state) => {
        let gazeDirection = processGazeDirection(gazeInfo.gazeDirection);
        ref.current.geometry.setFromPoints([new THREE.Vector3(RIGHT_EYE_OFFSET_X, RIGHT_EYE_OFFSET_Y, RIGHT_EYE_OFFSET_Z), new THREE.Vector3(RIGHT_EYE_OFFSET_X + gazeDirection.x, RIGHT_EYE_OFFSET_Y + gazeDirection.y, RIGHT_EYE_OFFSET_Z + gazeDirection.z)])
    })


    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)


    return (
        <group >
            <line ref={ref} geometry={lineGeometry}>
                <lineBasicMaterial attach="material" color={'green'} linewidth={900} linecap={'round'} linejoin={'round'} />
            </line>
            <mesh ref={refGazeOrigin} visible userData={{ test: "hello" }} position={[300, 300, 0]} castShadow>
                <sphereGeometry attach="geometry" args={[1, 16, 16]} />
                <meshStandardMaterial
                    attach="material"
                    color="white"
                    transparent
                    roughness={0.1}
                    metalness={0.1}
                />
            </mesh>
        </group>
    )

}

export default GazeLine;