import {MemoryObject} from "./types";
import Card from "@mui/material/Card";
import {useStreamData} from "../../api/rest";
import React, {useMemo} from "react";
import {prettyJSON} from "../LiveStream";
import MemoryObjectList from "./memory-object-list";
import {processMemoryStream} from "./utils";
import {StreamInfo} from "../LiveStream";


interface MemoryObjectCardProps{
    memoryObject: MemoryObject
}

export const memoryFormatter = msg => msg ? JSON.parse(msg) : msg


export const MemoryObjectView = ({ streamId }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, utf: true  })
    console.log(data)
    const formatted = useMemo(() => data && memoryFormatter ? memoryFormatter(data) : data, [data])

    console.log(formatted)


    if(!formatted){
        return (
             <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>

             </StreamInfo>
        )
    }

    let memoryObjects = processMemoryStream(formatted)

    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <MemoryObjectList memoryObjects={memoryObjects}></MemoryObjectList>
        </StreamInfo>
    )
}


