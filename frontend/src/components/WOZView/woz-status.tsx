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

interface WozStatusCompStatus {
    recipe: Recipe,
    currentStep: number,
    reasoningFrameData: any,
    clipActionFrameData: any,
    egovlpActionFrameData: any,
    worldFrameData: any,
    state: any
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

export default function WozStatusComp({
                                          currentStep, recipe, state,
                                          reasoningFrameData, egovlpActionFrameData,
                                          worldFrameData,
                                          clipActionFrameData
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
                    <AnnotationControlComp mode={"auto"} recipe={recipe} state={state}
                                           annotationData={annotationData}
                                           setAnnotationData={setAnnotationData}
                                           errorStatus={errorStatus}
                    ></AnnotationControlComp>
                )}
            </AnnotationContext.Consumer>

            { recipe && <AnnotationContext.Consumer>
                {({}) => (
                    <ObjectPanelContainer recipe={recipe} detectedObjects={worldFrameData ? worldFrameData.data.map(d => d.label) : []}/>
                )}
            </AnnotationContext.Consumer>}

            <Card>
                <CardHeader title={"Reasoning"}>

                </CardHeader>
                <CardContent>
                    <ReasoningNextStepRow>

                        <Box sx={{m: 1, position: 'relative', paddingBottom: 4}}>
                            {/*<Fab*/}
                            {/*    aria-label="save"*/}
                            {/*    color="primary"*/}
                            {/*    sx={{*/}
                            {/*        ...buttonSx,*/}
                            {/*        position: 'absolute',*/}
                            {/*        top: -5.5 - 7,*/}
                            {/*        left: -6 + iconOffset,*/}
                            {/*        zIndex: 1,*/}
                            {/*    }}*/}
                            {/*    size={"small"}*/}
                            {/*>*/}
                            {/*    <ArrowForwardIcon*/}
                            {/*        width={10}*/}
                            {/*    />*/}
                            {/*</Fab>*/}
                            <NextPlanRoundedIcon
                                aria-label="save"
                                color="success"
                                sx={{
                                    position: 'absolute',
                                    top: -5.5 - 7,
                                    left: -6 + iconOffset,
                                    zIndex: 1,
                                }}
                                fontSize={"large"}
                                onClick={handleClickNext}
                            >

                            </NextPlanRoundedIcon>
                            <CircularProgress
                                size={42}
                                value={95}
                                variant="determinate"
                                sx={{
                                    // color: "gray",
                                    color: green[500],
                                    position: 'absolute',
                                    top: -11 - 5,
                                    left: -10 + iconOffset,
                                    zIndex: 1,
                                }}
                            />
                            <ErrorIcon
                                fontSize={"large"}
                                sx={{
                                    color: (reasoningFrameData && reasoningFrameData.error_status) ? "red" : "gray",
                                    position: 'absolute',
                                    top: -11 - 3,
                                    left: 60 + iconOffset,
                                    zIndex: 1,
                                }}
                            >

                            </ErrorIcon>
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    top: -5.5,
                                    left: 1
                                }}
                                display={"inline"} variant={"body1"}>
                                Step.{reasoningFrameData && reasoningFrameData['step_id']}: {reasoningFrameData && recipe.instructions[reasoningFrameData['step_id']]}
                            </Typography>
                        </Box>

                    </ReasoningNextStepRow>
                    <div>
                        {
                            // subSteps.map(step => (<SubStepRow subStepInstruction={step}></SubStepRow>))
                        }

                    </div>
                    <ClipOutputsView data={clipActionFrameData}/>
                    {/*<ActionComp action={"put-into cupcake liner, mug"}></ActionComp>*/}
                    {/*<ErrorComp></ErrorComp>*/}
                    <ObjectListComp
                        objects={worldFrameData ? worldFrameData.data.map(d => d.label) : []}></ObjectListComp>
                </CardContent>
            </Card>

        </div>
    )
}