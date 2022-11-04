import React, { Suspense, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import {useGLTF, useTexture, useAnimations, Stage} from "@react-three/drei"
import { a, useSpring } from "@react-spring/three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from "three";


const boundingBoxSize = {
    x: 1200, y: 1200, z: 1800
}

function BoundingBoxEnvironment(props) {
    const points = []

    points.push(new THREE.Vector3(boundingBoxSize.x/2, boundingBoxSize.y/2, boundingBoxSize.z/2))
    points.push(new THREE.Vector3(boundingBoxSize.x/2, boundingBoxSize.y/2, -boundingBoxSize.z/2))
    points.push(new THREE.Vector3(boundingBoxSize.x/2, -boundingBoxSize.y/2, -boundingBoxSize.z/2))
    points.push(new THREE.Vector3(boundingBoxSize.x/2, -boundingBoxSize.y/2, boundingBoxSize.z/2))
    points.push(new THREE.Vector3(boundingBoxSize.x/2, boundingBoxSize.y/2, boundingBoxSize.z/2))
    points.push(new THREE.Vector3(-boundingBoxSize.x/2, boundingBoxSize.y/2, boundingBoxSize.z/2))
    points.push(new THREE.Vector3(-boundingBoxSize.x/2, boundingBoxSize.y/2, -boundingBoxSize.z/2))
    points.push(new THREE.Vector3(-boundingBoxSize.x/2, -boundingBoxSize.y/2, -boundingBoxSize.z/2))
    points.push(new THREE.Vector3(-boundingBoxSize.x/2, -boundingBoxSize.y/2, boundingBoxSize.z/2))
    points.push(new THREE.Vector3(-boundingBoxSize.x/2, boundingBoxSize.y/2, boundingBoxSize.z/2))

    points.push(new THREE.Vector3(-boundingBoxSize.x/2, boundingBoxSize.y/2, boundingBoxSize.z/2))
    points.push(new THREE.Vector3(-boundingBoxSize.x/2, -boundingBoxSize.y/2, boundingBoxSize.z/2))

    points.push(new THREE.Vector3(boundingBoxSize.x/2, -boundingBoxSize.y/2, boundingBoxSize.z/2));
    points.push(new THREE.Vector3(boundingBoxSize.x/2, -boundingBoxSize.y/2, -boundingBoxSize.z/2))
    points.push(new THREE.Vector3(-boundingBoxSize.x/2, -boundingBoxSize.y/2, -boundingBoxSize.z/2))

    points.push(new THREE.Vector3(-boundingBoxSize.x/2, boundingBoxSize.y/2, -boundingBoxSize.z/2))
    points.push(new THREE.Vector3(boundingBoxSize.x/2, boundingBoxSize.y/2, -boundingBoxSize.z/2))

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

    return (
        <group position={[0, 0, 0]}>
            <line  geometry={lineGeometry}>
                <lineBasicMaterial attach="material" color={'green'} linewidth={100} linecap={'round'} linejoin={'round'} />
            </line>
            <mesh  visible userData={{ test: "hello" }} position={[0, 0, 0]} castShadow>
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

export default BoundingBoxEnvironment;
