import React, { Suspense, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import {useGLTF, useTexture, useAnimations, Stage} from "@react-three/drei"
import { a, useSpring } from "@react-spring/three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from "three";
import ScatterObject from "./scatter-object";



function MemoryObjects(props) {

    return (
        <group position={[0, 0, 0]}>
            {
                props.memoryObjects.map((object) => {
                    return (
                        <ScatterObject showingLabel={props.showingLabel} object={object}></ScatterObject>
                    )
                })
            }
        </group>
    )


}

export default MemoryObjects;
