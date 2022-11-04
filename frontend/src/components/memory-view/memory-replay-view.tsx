import {GazeInfo, MemoryObject} from "./types";
import Card from "@mui/material/Card";
import {useStreamData} from "../../api/rest";
import React, {useEffect, useMemo, useState} from "react";

import MemoryObjectList from "./memory-object-list";
import {processMemoryStream} from "./utils";
import {StreamView} from "../StreamDataView/LiveStream";
import Memory3DScatter from "./3d-view/3d-scatter";
import {FormControlLabel, styled, Switch} from "@mui/material";
import SampleData from "./sample.json";
import {MemoryThreeView, MemoMemoryThreeView} from "./3d-view/three-viewer";
import {StreamInfo} from "./stream";

interface MemoryObjectCardProps{
    memoryObject: MemoryObject
}

const ControlPanel = styled("div")(() => ({
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "flex-end"
}))

export const memoryFormatter = msg => msg ? JSON.parse(msg) : msg

const jsonFormatter = msg => msg? JSON.parse(msg) : msg;


function extractGazeInfo(eyeData: any) : GazeInfo{
    if(!eyeData){
        return {
            gazeOrigin: [0, 0, 0],
            gazeDirection: [-0.1, 0.3, -0.2]
        }
    }
    return {
        gazeOrigin: [eyeData.GazeOrigin.x, eyeData.GazeOrigin.y, -eyeData.GazeOrigin.z],
        gazeDirection: [-eyeData.GazeDirection.x, eyeData.GazeDirection.y, eyeData.GazeDirection.z]
    }
}

export const MemoryReplayView = ({eyeFrameData, memoryFrameData }) => {

    let gazeInfo = extractGazeInfo(eyeFrameData);
    const [shown3d, setShown3D] = useState<boolean>(true);
    const [running, setRunning] = useState<boolean>(true);
    const [showingLabel, setShowingLabel] = useState<boolean>(true);
    const [lastMemoryObjects, setLastMemoryObjects] = useState<Array<MemoryObject>>([]);



    let memoryObjects: Array<MemoryObject>;
    if(!memoryFrameData){
        memoryObjects = undefined // processMemoryStream(SampleData);
    }else{
        memoryObjects = processMemoryStream(memoryFrameData.data)
    }
    let fetchedObjectNum = memoryObjects?memoryObjects.length:0;
    useEffect(() => {
        if(memoryObjects && memoryObjects.length > 0){
            setLastMemoryObjects(memoryObjects);
        }
    }, [fetchedObjectNum])

    let chooseMemoryObjects = (memoryObjects, lastMemoryObjects) => {
        if(memoryObjects && memoryObjects.length > 0){
            return memoryObjects;
        }else {
            return lastMemoryObjects;
        }
    }
    return (

        <div>
            <ControlPanel>
                <FormControlLabel
                    control={
                        <Switch
                            checked={shown3d}
                            onChange={() => {
                                setShown3D(oldValue => !oldValue)
                            }}
                            defaultChecked />
                    }
                    label="3D"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={!running}
                            onChange={() => {
                                setRunning(oldValue => !oldValue)
                            }}
                            defaultChecked />
                    }
                    label="Focus"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={showingLabel}
                            onChange={() => {
                                setShowingLabel(oldValue => !oldValue)
                            }}
                            defaultChecked />
                    }
                    label="Label"
                />
            </ControlPanel>

            {shown3d && <MemoMemoryThreeView
                showingLabel={showingLabel}
                updating={running}
                memoryObjects={chooseMemoryObjects(memoryObjects, lastMemoryObjects)} gazeInfo={gazeInfo}/>}
            { !shown3d && <MemoryObjectList memoryObjects={chooseMemoryObjects(memoryObjects, lastMemoryObjects)}></MemoryObjectList>}
            {/*{ shown3d && <Memory3DScatter gazeInfo={gazeInfo} memoryObjects={memoryObjects}></Memory3DScatter>}*/}
        </div>
    )
}


