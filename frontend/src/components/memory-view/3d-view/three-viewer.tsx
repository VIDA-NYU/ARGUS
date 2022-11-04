import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ReactPlayer from "react-player";
import {MediaState} from "../../HistoricalDataView";
import {GazeInfo, MemoryObject} from "../types";
import {MemoryCanvas} from "./three/canvas";
import EyeCanvas from "./three/tmp-canvas";
import {styled} from "@mui/material";
import React from "react";


interface MemoryThreeViewProps {
    memoryObjects: Array<MemoryObject>,
    gazeInfo: GazeInfo,
    updating: boolean,
    showingLabel: boolean
}

const ContentContainer = styled(CardContent)(()=>({
    width: 600,
    height: 1000
}))

function MemoryThreeView ({gazeInfo, memoryObjects, showingLabel}: MemoryThreeViewProps){

    return (
        <>
            <ContentContainer>
                <MemoryCanvas
                    showingLabel={showingLabel}
                    memoryObjects={memoryObjects} gazeInfo={gazeInfo} />
                {/*<EyeCanvas />*/}
            </ContentContainer>
        </>
    )
}
const MemoMemoryThreeView = React.memo(MemoryThreeView, (prevProps, nextProps) => {
    if(nextProps.showingLabel !== prevProps.showingLabel){
        return false
    }
    else if(!nextProps.updating){
        return true
    }else{
        return  prevProps === nextProps
    }
});

export {MemoryThreeView, MemoMemoryThreeView};