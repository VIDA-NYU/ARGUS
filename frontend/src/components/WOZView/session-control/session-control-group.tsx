import {styled} from "@mui/material";
import SessionControlPanel from "./session-control-panel";
import SessionSelectionPanel from "./session-selection-panel";
import {AnnotationData, AnnotationMeta} from "../annotation/types";

interface SessionControlGroupProps {
    annotationData: AnnotationData,
    setAnnotationData: (value: AnnotationData) => void,
    recordingList: Array<string>
}

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    marginRight: 6,
    flexBasis: 3,
    flexGrow: 3,
    alignItems: "stretch"
})

export default function SessionControlGroup({annotationData, setAnnotationData, recordingList}: SessionControlGroupProps){
    const setAnnotationMeta = (newMeta: AnnotationMeta) => {
        setAnnotationData({
            ...annotationData,
            meta: newMeta
        })
    }

    return (
        <Container>
            <SessionSelectionPanel
                annotationMeta={annotationData.meta}
                setAnnotationMeta={setAnnotationMeta}
                recordingList={recordingList}
            />
            <SessionControlPanel/>
        </Container>
    )
}