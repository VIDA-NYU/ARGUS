import {Recipe} from "../../api/types";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {styled} from "@mui/material";
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {green} from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, {useState} from "react";
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {ClipOutputsView} from "../StreamDataView/PerceptionOutputsView";
import ErrorIcon from '@mui/icons-material/Error';

import NextPlanRoundedIcon from '@mui/icons-material/NextPlanRounded';
import AnnotationControlComp from "./annotation-comps/annotation-control-comp";
import {AnnotationContext} from "./annotation/provider";
import ObjectPanelContainer from "./object-comps/object-panel-container";
import SessionControlGroup from "./session-control/session-control-group";
import RecipeTextComp from "./recipe/recipe-text";


interface WozStatusCompStatus {
    recipe: Recipe,
    currentStep: number,
    currentTimestampValue: number,
    reasoningFrameData: any,
    clipActionFrameData: any,
    egovlpActionFrameData: any,
    worldFrameData: any,
    state: any,
    recordingList: Array<string>,
    recipeIDList: Array<string>
}

const ReasoningNextStepRow = styled("div")({
        flexDirection: "row"
    }
);
const label = {inputProps: {'aria-label': 'Checkbox demo'}};

const SubStepRowContainer = styled("div")(() => ({
    flexDirection: "row",
    marginLeft: 40,
    marginBottom: 0
}));

const SubStepRow = ({subStepInstruction}) => {
    return (
        <SubStepRowContainer>
            <Checkbox {...label} size={"small"} defaultChecked/>
            <Typography display="inline" variant={"body2"}>
                {subStepInstruction}
            </Typography>
        </SubStepRowContainer>
    )
}

const ErrorBar = ({error}) => {
    return (
        <Chip label={error}/>

    )

}

const ErrorCompContainer = styled("div")(() => ({
    flexDirection: "row",
}))
const ErrorComp = () => {
    const errors = [
        "wrong knife", "dirty paper"
    ]
    return (
        <ErrorCompContainer>

            <Stack alignItems={"center"} direction="row" spacing={1}>
                <Typography display={"inline"} variant={"body1"}>
                    Error
                </Typography>
                {errors.map(error => (
                    <ErrorBar error={error}></ErrorBar>
                ))}
            </Stack>
        </ErrorCompContainer>


    )
}

const ObjectListComp = ({objects}) => {

    return (
        <ErrorCompContainer>

            <Stack alignItems={"center"} direction="row" spacing={1}>
                <Typography display={"inline"} variant={"body1"}>
                    Objects
                </Typography>
                {objects.map(error => (
                    <ErrorBar error={error}></ErrorBar>
                ))}
            </Stack>
        </ErrorCompContainer>


    )
}


const ActionComp = ({action}) => {

    return (
        <ErrorCompContainer>

            <Stack alignItems={"center"} direction="row" spacing={1}>
                <Typography display={"inline"} variant={"body1"}>
                    Action
                </Typography>
                <Typography variant={"body1"}>
                    {
                        action
                    }
                </Typography>
            </Stack>
        </ErrorCompContainer>
    )
}

const iconOffset = 480;

const RowComponent = styled("div")({
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px",
    alignItems: "stretch",
})

const ObjectCompContainer = styled("div")({
    flexBasis: 4,
    flexGrow: 4,
    marginRight: 8
})

export default function WozStatusComp({
                                          currentStep, recipe, state,
                                          reasoningFrameData, egovlpActionFrameData,
                                          worldFrameData,
                                          clipActionFrameData, recordingList,
                                          recipeIDList, currentTimestampValue
                                      }:
                                          WozStatusCompStatus) {

    const buttonSx = {
        ...(true && {
            // bgcolor: "gray",
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
        fontSize: 14
    };

    const subSteps = [
        "pick up the knife", "pick up the towel", "wipe the knife with the paper"
    ]

    const handleClickNext = () => {

    }

    let errorStatus = reasoningFrameData && reasoningFrameData.error_status

    return (
        <div>

            <AnnotationContext.Consumer>
                {({annotationData, setAnnotationData}) => (
                    <RowComponent>
                        <SessionControlGroup
                            annotationData={annotationData}
                            setAnnotationData={setAnnotationData}
                            recordingList={recordingList}
                            recipeIDList={recipeIDList}
                        />
                        <AnnotationControlComp
                            currentTimeStampValue={currentTimestampValue}
                            mode={"auto"} recipe={recipe} state={state}
                                               annotationData={annotationData}
                                               setAnnotationData={setAnnotationData}
                                               errorStatus={errorStatus}

                        ></AnnotationControlComp>
                    </RowComponent>

                )}
            </AnnotationContext.Consumer>

            {recipe && <RowComponent> <RecipeTextComp recipeInstructions={recipe.instructions} currentStep={currentStep}/></RowComponent>}

            <RowComponent>
                {recipe && <ObjectCompContainer><AnnotationContext.Consumer>
                    {({}) => (
                        <ObjectPanelContainer recipe={recipe}
                                              detectedObjects={worldFrameData && worldFrameData.data ? worldFrameData.data.map(d => d.label) : []}/>
                    )}
                </AnnotationContext.Consumer> </ObjectCompContainer>}
                <Card sx={{
                    flexBasis: 2,
                    flexGrow: 2,
                }}>
                    <CardHeader title={"Reasoning"} titleTypographyProps={{variant: "body1"}}>

                    </CardHeader>
                    <CardContent>
                        {reasoningFrameData && <AnnotationContext.Consumer>
                            {
                                ({annotationData}) => (<ClipOutputsView data={annotationData.meta.mode === "online" ? egovlpActionFrameData: clipActionFrameData}/>)
                            }

                        </AnnotationContext.Consumer>}
                    </CardContent>
                </Card>

            </RowComponent>

        </div>
    )
}