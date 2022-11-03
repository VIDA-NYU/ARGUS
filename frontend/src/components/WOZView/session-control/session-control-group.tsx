import {styled} from "@mui/material";
import SessionControlPanel from "./session-control-panel";
import SessionSelectionPanel from "./session-selection-panel";
import {AnnotationData, AnnotationMeta} from "../annotation/types";
import {resetHumanAnnotation} from "../annotation/utils";
import {uploadAnnotation} from "../utils/rest";

interface SessionControlGroupProps {
    annotationData: AnnotationData,
    setAnnotationData: (value: AnnotationData) => void,
    recordingList: Array<string>,
    recipeIDList: Array<string>
}

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    marginRight: 15,
    flexBasis: 3,
    flexGrow: 3,
    alignItems: "stretch",
    justifyContent: "space-between"
})

export default function SessionControlGroup({annotationData, setAnnotationData, recordingList, recipeIDList}: SessionControlGroupProps){
    const setAnnotationMeta = (newMeta: AnnotationMeta) => {
        setAnnotationData({
            ...annotationData,
            meta: newMeta
        })
    }

    const handleResettingAnnotationData = () => {
        setAnnotationData(resetHumanAnnotation(annotationData));
    }

    const handleSavingAnnotationData = () => {
        uploadAnnotation(annotationData.meta.id, annotationData).then(r => {
            alert("Annotation saved!");
        })
    }

    return (
        <Container>
            <SessionSelectionPanel
                annotationMeta={annotationData.meta}
                setAnnotationMeta={setAnnotationMeta}
                recordingList={recordingList}
                recipeIDList={recipeIDList}
            />
            <SessionControlPanel
                onResettingAnnotation={handleResettingAnnotationData}
                onSavingAnnotation={handleSavingAnnotationData}
            />
        </Container>
    )
}