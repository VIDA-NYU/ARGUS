import {MemoryObject} from "./types";
import Card from "@mui/material/Card";
import {useStreamData} from "../../api/rest";
import React, {useMemo, useState} from "react";
import {prettyJSON} from "../LiveStream";
import MemoryObjectList from "./memory-object-list";
import {processMemoryStream} from "./utils";
import {StreamInfo} from "../LiveStream";
import Memory3DScatter from "./3d-view/3d-scatter";
import {FormControlLabel, styled, Switch} from "@mui/material";


interface MemoryObjectCardProps{
    memoryObject: MemoryObject
}

const ControlPanel = styled("div")(() => ({
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "flex-end"
}))

export const memoryFormatter = msg => msg ? JSON.parse(msg) : msg



export const MemoryObjectView = ({ streamId }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, utf: true  })
    const formatted = useMemo(() => data && memoryFormatter ? memoryFormatter(data) : data, [data])

    const [shown3d, setShown3D] = useState<boolean>(true)
    const [lastMemoryObjects, setLastMemoryObjects] = useState<Array<MemoryObject>>([]);

    // if(!formatted){
    //     return (
    //          <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
    //          </StreamInfo>
    //     )
    // }

    let memoryObjects: Array<MemoryObject>;
    if(!formatted){
        memoryObjects = [];
    }else{
        memoryObjects = processMemoryStream(formatted)
    }


    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
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
            </ControlPanel>

            { !shown3d && <MemoryObjectList memoryObjects={memoryObjects}></MemoryObjectList>}
            { shown3d && <Memory3DScatter memoryObjects={memoryObjects}></Memory3DScatter>}
        </StreamInfo>
    )
}


