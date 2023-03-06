import {styled} from "@mui/material";
import Card from "@mui/material/Card";
import {useState} from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {AnnotationMeta} from "../annotation/types";
import SessionModeSwitch from "./session-mode-switch";
import {buildNewAnnotationMeta} from "../annotation/utils";


interface SessionSelectionPanelProps {
    annotationMeta: AnnotationMeta,
    setAnnotationMeta: (value: AnnotationMeta) => void,
    recordingList: Array<string>,
    recipeIDList: Array<string>
}


const Container = styled("div")({
    marginBottom: 10,
    flexBasis: 2,
    flexGrow: 2
})

const Content = styled("div")({
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
    marginRight: "20px",
    marginBottom: "10px",
    alignItems: "center",
    height: "100%"

})

const SelectorColumn = styled("div")({
    display: "flex",
    flexDirection: "column",
})

const StyledFormControl = styled(FormControl)({
    marginBottom: "3px"
})

export default function SessionSelectionPanel({annotationMeta, setAnnotationMeta, recordingList, recipeIDList}:
                                                  SessionSelectionPanelProps) {
    let myRecordingList = recordingList ? recordingList : [];
    const [selectedRecording, setSelectedRecording] = useState<string>(undefined);

    const handleChange = (event: SelectChangeEvent) => {
        setAnnotationMeta(buildNewAnnotationMeta({
            ...annotationMeta,
            id: event.target.value as string
        }))
        // setSelectedRecording(event.target.value as string)
    }

    const handleRecipeChange = (event: SelectChangeEvent) => {
        setAnnotationMeta(buildNewAnnotationMeta({
            ...annotationMeta,
            recipeID: event.target.value as string
        }))
        // setSelectedRecording(event.target.value as string)
    }

    const handleChangeRecording = (event: SelectChangeEvent) => {
        // const index = Number(event.target.value);
        // setRecordingID(index);
        // recordings && setRecordingID(recordings[index]);
        // setState({ ...state, totalDuration: "0:0" });
    };

    const handleModeSwitching = (newMode: "online" | "offline") => {
        setAnnotationMeta(
            buildNewAnnotationMeta({
                ...annotationMeta,
                mode: newMode
            })
        )
    }


    return (
        <Container>
            <Card sx={{
                height: "100%"
            }}>
                <Content>
                    <SessionModeSwitch
                        onSwitchMode={handleModeSwitching}
                        annotationMeta={annotationMeta}
                    />
                    <SelectorColumn>
                        <StyledFormControl
                            disabled={annotationMeta.mode === "online"}
                            variant="standard"
                            fullWidth>
                            <InputLabel id="demo-simple-select-label">Recordingsss</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={annotationMeta.id}
                                label="Age"
                                onChange={handleChange}
                            >
                                {
                                    myRecordingList.map(recordingName => (
                                        <MenuItem key={`item-${recordingName}`} value={recordingName}>{recordingName}</MenuItem>
                                    ))
                                }
                            </Select>
                        </StyledFormControl>
                        <FormControl
                            variant="standard"
                            fullWidth>
                            <InputLabel id="demo-simple-select-label">Recipe</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={annotationMeta.recipeID}
                                label="Age"
                                onChange={handleRecipeChange}
                            >
                                {
                                    recipeIDList.map(recipeID => (
                                        <MenuItem key={`item-${recipeID}`} value={recipeID}>{recipeID}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </SelectorColumn>

                </Content>


            </Card>
        </Container>
    )
}