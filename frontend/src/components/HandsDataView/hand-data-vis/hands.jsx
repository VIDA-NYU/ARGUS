import React, {Suspense, useEffect, useRef, useState} from 'react';
import {
    MeshDistortMaterial,
    MeshWobbleMaterial,
    Sphere
} from "@react-three/drei";
import codeNode from "three/examples/jsm/nodes/core/CodeNode";
import * as THREE from "three";
import data from "bootstrap/js/src/dom/data";

const OFFSET = {
    x: 0,
    y: 0,
    z: 0
    // x: 1.936,
    // y: -0.592,
    // z: 0.317
}

function buildHandJointIndex(handData){
    let jointIndex = {};
    for (let joint of handData.items){
        jointIndex[joint.joint] = joint;
    }
    return jointIndex;
}

function buildOffsets(data, seq){

    if(data.length){
        let firstFrameData = data[0];

        let leftJoint = data[seq % data.length].left.items[2].pose.position;
        let rightJoint = data[seq % data.length].right.items[2].pose.position;

        return [{x: 0, y: 0, z: 0}, {x: leftJoint.x, y: leftJoint.y, z: leftJoint.z}, {x: rightJoint.x, y: rightJoint.y, z: rightJoint.z}]
    }else{
        return [{x:0, y:0, z:0}, {x:0, y:0, z:0}, {x:0, y:0, z:0}]
    }
}

function buildJointLinks(handData){
    let jointIndex = buildHandJointIndex(handData);
    let jointLinks = [
        {source: jointIndex["Wrist"], target: jointIndex["ThumbMetacarpalJoint"]},
        // {source: jointIndex["Wrist"], target: jointIndex["Palm"]},
        {source: jointIndex["Palm"], target: jointIndex["ThumbMetacarpalJoint"]},
        {source: jointIndex["ThumbMetacarpalJoint"], target: jointIndex["ThumbProximalJoint"]},
        {source: jointIndex["ThumbProximalJoint"], target: jointIndex["ThumbDistalJoint"]},
        {source: jointIndex["ThumbDistalJoint"], target: jointIndex["ThumbTip"]},

        {source: jointIndex["Wrist"], target: jointIndex["IndexMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["IndexMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["IndexKnuckle"]},
        {source: jointIndex["IndexKnuckle"], target: jointIndex["ThumbMetacarpalJoint"]},
        {source: jointIndex["IndexKnuckle"], target: jointIndex["IndexMiddleJoint"]},
        {source: jointIndex["IndexMiddleJoint"], target: jointIndex["IndexDistalJoint"]},
        {source: jointIndex["IndexDistalJoint"], target: jointIndex["IndexTip"]},

        {source: jointIndex["Wrist"], target: jointIndex["MiddleMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["MiddleMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["MiddleKnuckle"]},
        {source: jointIndex["MiddleKnuckle"], target: jointIndex["MiddleMiddleJoint"]},
        {source: jointIndex["MiddleMiddleJoint"], target: jointIndex["MiddleDistalJoint"]},
        {source: jointIndex["MiddleDistalJoint"], target: jointIndex["MiddleTip"]},

        {source: jointIndex["Wrist"], target: jointIndex["RingMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["RingMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["RingKnuckle"]},
        {source: jointIndex["RingKnuckle"], target: jointIndex["RingMiddleJoint"]},
        {source: jointIndex["RingMiddleJoint"], target: jointIndex["RingDistalJoint"]},
        {source: jointIndex["RingDistalJoint"], target: jointIndex["RingTip"]},

        {source: jointIndex["Wrist"], target: jointIndex["PinkyMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["PinkyMetacarpal"]},
        {source: jointIndex["PinkyKnuckle"], target: jointIndex["PinkyMetacarpal"]},
        {source: jointIndex["Palm"], target: jointIndex["PinkyKnuckle"]},
        {source: jointIndex["PinkyKnuckle"], target: jointIndex["PinkyMiddleJoint"]},
        {source: jointIndex["PinkyMiddleJoint"], target: jointIndex["PinkyDistalJoint"]},
        {source: jointIndex["PinkyDistalJoint"], target: jointIndex["PinkyTip"]},
        // {source: jointIndex["ThumbMetacarpalJoint"], target: jointIndex["ThumbProximalJoint"]},
        // {source: jointIndex["ThumbMetacarpalJoint"], target: jointIndex["ThumbProximalJoint"]},
    ]
    return jointLinks;
}

function getPlayedIndex(played, seqLen){
    if(!seqLen){
        return 0;
    }
    if(played < 1){
        return Math.floor(played * seqLen);
    }else{
        return  seqLen - 1;
    }
}


function HandsModel(props) {


    // let seq = getPlayedIndex(props.state.played, props.data.length);

    // let frameData = props.data[seq % props.data.length];

    let offsets = buildOffsets(props.data, props.frameIndex);
    let frameData = props.frameData;

    let renderJointLink = (jointLink, offset) => {
        const points = [

        ]
        let srcPos = jointLink.source.pose.position;
        let tgtPos = jointLink.target.pose.position;

        points.push(new THREE.Vector3(srcPos.x - offset.x, srcPos.y - offset.y, srcPos.z - offset.z));
        points.push(new THREE.Vector3(tgtPos.x - offset.x, tgtPos.y - offset.y, tgtPos.z - offset.z));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        return (
            <line geometry={lineGeometry}>
                <lineBasicMaterial attach="material" color={'grey'} linewidth={100} linecap={'round'} linejoin={'round'} />
            </line>
        )
    }

    let renderJoint = (jointData, offset) => {
        let pos = jointData.pose.position;
        return (
            <Sphere visible position={[pos.x - offset.x, pos.y - offset.y, pos.z - offset.z].map(v => v)} args={[0.003, 16, 200]}>
                <MeshDistortMaterial
                    color="steelblue"
                    attach="material"
                    distort={0} // Strength, 0 disables the effect (default=1)
                    speed={0} // Speed (default=1)
                    roughness={0}
                />
            </Sphere>
        )
    }

    let renderHand = (handData, offset) => {
        let jointLinks = buildJointLinks(handData);
        return (
            <group>
                {
                    handData.items.map(joint => renderJoint(joint, offset))
                }
                {
                    jointLinks.map(link => renderJointLink(link, offset))
                }
            </group>
        )
    }

    return (
        <group position={[0, 0, 0]}>
            {frameData && frameData.left && props.variant === "left" && renderHand(frameData.left, offsets[1])}
            {frameData && frameData.right && props.variant === "right" && renderHand(frameData.right, offsets[2])}

            {frameData && frameData.left && props.variant === "overview" && renderHand(frameData.left, offsets[0])}
            {frameData && frameData.right && props.variant === "overview" && renderHand(frameData.right, offsets[0])}
        </group>
    )


}

export default HandsModel;
