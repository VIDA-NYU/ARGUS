import {MemoryObject} from "./types";
import MemoryObjectCard from "./memory-object-card";
import {styled} from "@mui/material";

interface MemoryObjectListProps {
    memoryObjects: Array<MemoryObject>
}

const ContainerDiv = styled('div')(() => {
    return {
        height: 400,
        overflowY: "scroll"
    }
})

export default function MemoryObjectList({memoryObjects}: MemoryObjectListProps){
    return (
        <ContainerDiv>
            {
                memoryObjects.map(object => {
                    return (
                        <MemoryObjectCard memoryObject={object}></MemoryObjectCard>
                    )
                })
            }
        </ContainerDiv>
    )
}
