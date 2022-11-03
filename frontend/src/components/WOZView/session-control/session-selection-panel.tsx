import {styled} from "@mui/material";
import Card from "@mui/material/Card";
import {useState} from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {AnnotationMeta} from "../annotation/types";
import SessionModeSwitch from "./session-mode-switch";


interface SessionSelectionPanelProps {
    annotationMeta: AnnotationMeta,
    setAnnotationMeta: (value: AnnotationMeta) => void,
    recordingList: Array<string>
}


const Container = styled("div")({
    marginBottom: 10
})

const Content = styled("div")({
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
    marginRight: "8px"
})

export default function SessionSelectionPanel({annotationMeta, setAnnotationMeta, recordingList}:
                                                  SessionSelectionPanelProps) {

    const [selectedRecording, setSelectedRecording] = useState<string>(undefined);

    const handleChange = (event: SelectChangeEvent) => {
        setAnnotationMeta({
            ...annotationMeta,
            id: event.target.value as string
        })
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
            {
                ...annotationMeta,
                mode: newMode
            }
        )
    }


    return (
        <Container>
            <Card>
                <Content>
                    <SessionModeSwitch
                        onSwitchMode={handleModeSwitching}
                        annotationMeta={annotationMeta}
                    />
                    <FormControl
                        variant="standard"
                        fullWidth>
                        <InputLabel id="demo-simple-select-label">Recording</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={annotationMeta.id}
                            label="Age"
                            onChange={handleChange}
                        >
                            {
                                recordingList.map(recordingName => (
                                    <MenuItem key={`item-${recordingName}`} value={recordingName}>{recordingName}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Content>


            </Card>
        </Container>
    )
}