import {extend, useThree} from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import fontFile from "../text/Open_Sans_Regular.json";
import {addVector3D} from "../utils/utils";
import React, {useRef, useEffect, useState} from "react";

import * as THREE from 'three';

import { Text } from "troika-three-text";


function convertCoordinate(memoryObject){
    let scaleLength = 1000;
    return [
        scaleLength * memoryObject.center.x, scaleLength * memoryObject.center.y, scaleLength * memoryObject.center.z
    ]
}
extend({ TextGeometry })
extend({ Text });



const font = new FontLoader().parse(fontFile);

export default function ScatterObject(props){




    const textRef = useRef(null)
    const textLabelRef = useRef(props.object.label);
    const textOffset = [20, 20, 50];

    const [textLabel, setTextLabel] = useState(props.object.label)
    const [rotation, setRotation] = useState([0, 0, 0, 0]);
    const [rerun, setRerun] = useState(false);
    const [myFont, setMyFont] = useState();
    const [fontLoaded, setFontLoaded] = useState(false)
    useEffect(() => {
        textLabelRef.current = props.object.label;
        // textRef.current.args = [ props.object.label, textRef.current.args[1]];
        setTextLabel(props.object.label);
        setTimeout(() => {
         // setTextLabel(" " + props.object.label + " ");
         //    setRerun(true)
        }, 3000)

    }, [props.object.label])

    useEffect(() => {
        const _font = new FontLoader().parse(fontFile);
        setMyFont(_font);
        setFontLoaded(true);
    }, [])

    useEffect(() => {

    })

    let renderText = () => {
        return (
            <mesh
                position={addVector3D(convertCoordinate(props.object), textOffset)}
            >
                {
                    fontLoaded &&  <textGeometry
                        args={[ textLabel  , {
                            font: myFont,
                            size:80, height: 20}]}/>
                }


                <meshLambertMaterial attach='material' color={'#c3c3c3'}/>
            </mesh>
        )
    }
    return (
        <group>
            <mesh
                position={addVector3D(convertCoordinate(props.object), textOffset)}
                >
                {
                    fontLoaded && props.showingLabel && <textGeometry
                            args={[ textLabel  , {
                                font: myFont,
                                size:100, height: 10}]}/>
                }


                <meshLambertMaterial attach='material' color={'#c3c3c3'}/>
            </mesh>
            {/*{renderText()}*/}

            <mesh
                position={convertCoordinate(props.object)}
            >
                <boxGeometry attach="geometry"  args={[50, 50, 50]} />
                <meshBasicMaterial attach="material" color="lightblue" />
            </mesh>
        </group>

    )
}