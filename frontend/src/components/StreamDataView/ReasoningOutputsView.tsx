import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip, IconButton, Icon, ListClassKey } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useRecordingControls, useStreamData } from '../../api/rest';
import DoneIcon from '@mui/icons-material/Done';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { blue, green } from '@mui/material/colors';
import WozStatusComp from "../WOZView/woz-status";
import { StreamView } from './LiveStream';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import { DETIC_IMAGE_STREAM, REASONING_ENTITIES_STREAM } from '../../config';
import RecipeTextComp from "../WOZView/recipe/recipe-text";
import {AnnotationContext} from "../WOZView/annotation/provider";
import {AnnotationData} from "../WOZView/annotation/types";
import {uploadAnnotation} from "../WOZView/utils/rest";

interface Entity {
  ingredients: string [],
  tools: string []
}
interface Entities {
  step_id: number,
  step_entities: Entity,
}
interface ObjLabel {
  xyxyn: number [],
  confidence: number,
  class_id: number,
  label: string
}
interface RenderedObjLabel {
  confidence: number,
  label: string,
  total: number
}

let entities: Entities [] = [];
let flag = true;
export const ReasoningOutputsView = ({ data }) => {
    const {step_id, step_status, step_description, error_status, error_description} = data || {};
    const {setStep} = useRecordingControls();
    const current_step = step_id + 1; // Reasoning handles indexes, so we need to add 1 to communicate the user they are in the first (1) step.
    return <Box display='flex' flexDirection='column' pt={5} mr={2} ml={2}>
        <span><b>Current Step:</b> {current_step}</span>
        {/* <span><b>Current Step:</b>{step_id || ' No active step.'}</span> */}
        <span><b>Description:</b> {step_description || 'No active step.'}</span>
        <span><b>Status:</b> {step_status}</span>
        <br/>
        <span><b>Errors:</b> {error_description || 'No errors.'}</span><br/>
        <span><b>Entities:</b></span>
        <Box sx={{gridArea: 'e', height: 50,}}>
            <StreamView utf streamId={DETIC_IMAGE_STREAM} showStreamId={false} showTime={false}>
                {data => (<Box><EntitiesView data={JSON.parse(data)} step_id={step_id}/></Box>)}
            </StreamView>
        </Box>
        <Box sx={{gridArea: 'z', height: 0,}}>
            <StreamView utf streamId={REASONING_ENTITIES_STREAM} showStreamId={false} showTime={false}
                        showStreamStatus={false}>
                {(data) => {
                    if (data) {
                        entities = JSON.parse(data);
                        flag = false;
                    }
                }}
            </StreamView>
        </Box>
    </Box>
}

const EntitiesView = ({data, step_id}: {data: ObjLabel [], step_id:number}) => {
  var listLabels = {};
  data && data.map((element:ObjLabel, index: number) => {
    if(element.confidence > 0.5) {
      if(Object.keys(listLabels).includes(element.label)){
        listLabels[element.label] = listLabels[element.label] +1;
      } else {
        listLabels[element.label] = 1;
      }
    }
  });
  var detectedObjects = Object.keys(listLabels).length>0 && Object.keys(listLabels).map((element:string, index: number) => {
    var label= element + ":" + listLabels[element];
    return <Chip label={label} size="small" />
    });
  let current_entities = (entities.length > 0 && step_id !== undefined) ? entities[step_id].step_entities.ingredients.concat(entities[step_id].step_entities.tools)  : [];

  var targetObjects = current_entities.length>0 && current_entities.map((element, index) => {
    var iconType = index < entities[step_id].step_entities.ingredients.length ? <LunchDiningOutlinedIcon /> : <RestaurantOutlinedIcon />;
    return <Chip icon={iconType} label={element} size="small" color={Object.keys(listLabels).includes(element) ? "success" : "default"} />;
    });

  return (
    <ol key={'steps_all'}>
      <li key={"objectes"}> Target Objects: {targetObjects} </li>
      <li key={"detected_objectes"}>  Detected Objects: {detectedObjects}
      </li>
    </ol>
  )
}

const ListSteps = ({list, completedStep}: { list: string [], completedStep: number }) => {
    return (
        <ol key={'steps_all'}>{
            list.map((value: string, index: number) => {
                return index < completedStep ? (
                    <li key={'steps_' + index} style={{color: "green"}}> {value} <DoneIcon
                        sx={{color: green[500], fontSize: 25}}></DoneIcon>
                    </li>
                ) : index === completedStep ? (
                    <li key={'steps_' + index} style={{color: "blue"}}> {value} <RotateLeftIcon
                        sx={{color: blue[700], fontSize: 25}}></RotateLeftIcon>
                    </li>
                ) : (
                    <li key={'steps_' + index}>  {value} </li>
                );
            })
        }
        </ol>
    )
}
export const ReasoningOutputsWOZView = ({
                                            data, recipe, reasoningFrameData,
                                            egovlpActionFrameData, clipActionFrameData,
                                            worldFrameData, state, recordingList,
                                            recipeIDList
                                        }) => {
    const {step_id, step_status, step_description, error_status, error_description} = data || {};
    // let step_id = 0;
    const current_step = step_id + 1;
    const {setStep} = useRecordingControls();
    const step_id_previous = (step_id - 1).toString();
    const step_id_next = (step_id + 1).toString();
    let machinePredictedStep = reasoningFrameData['step_id']
    const [currentUserStep, setCurrentUserStep] = useState<number>(0);

    const annotateReasoningStep = (stepId) => {

    }

    return <Box display='flex' flexDirection='column' pt={0} mr={2} ml={2}>
      <span style={{paddingBottom: 7}} ><b>{recipe && recipe.name} Recipe Steps</b></span>
      <span><b>Current Step: </b>{current_step} - <b>  Status:</b> {step_status}</span>
      {recipe && recipe.instructions && <ListSteps list={recipe.instructions} completedStep={step_id}/>}
      {/*<span><b>RECIPE STEPS</b></span>*/}
      {/*<span><b>Current Step: </b>{current_step} - <b>  Status:</b> {step_status}</span>*/}
        {recipe && <WozStatusComp
            recipeIDList={recipeIDList}
            state={state}
            worldFrameData={worldFrameData}
            egovlpActionFrameData={egovlpActionFrameData}
            clipActionFrameData={clipActionFrameData}
            reasoningFrameData={reasoningFrameData}
            recordingList={recordingList}
            recipe={recipe} currentStep={2}></WozStatusComp>}
        {/*{recipe && recipe.instructions &&*/}
        {/*    <RecipeTextComp recipeInstructions={recipe.instructions} currentStep={machinePredictedStep}/>}*/}
        {/*{recipe && recipe.instructions && <ListSteps list={recipe.instructions} completedStep={step_id}/>}*/}
        {/*<AnnotationContext.Consumer>*/}
        {/*    {*/}
        {/*        ({annotationData, setAnnotationData}) => (*/}
        {/*            <Box>*/}
        {/*                <Button onClick={() => setStep({step_id_s: step_id_previous})} variant="contained"*/}
        {/*                        style={{margin: 6}}><ArrowBackIcon/> Previous Step</Button>*/}
        {/*                <Button onClick={() => {*/}
        {/*                    setStep({step_id_s: step_id_next});*/}
        {/*                    let prevData = annotationData;*/}
        {/*                    setAnnotationData(*/}
        {/*                        {*/}
        {/*                            ...prevData,*/}
        {/*                            reasoningSteps: [...prevData.reasoningSteps, {*/}
        {/*                                type: "new_step",*/}
        {/*                                time: state.currentTime,*/}
        {/*                                step: currentUserStep + 1,*/}
        {/*                                prev: -1,*/}
        {/*                            }]*/}
        {/*                        }*/}
        {/*                    )*/}
        {/*                    setCurrentUserStep(currentUserStep + 1);*/}
        {/*                    console.log(prevData);*/}

        {/*                }} variant="contained"><ArrowForwardIcon/>Next Step</Button>*/}
        {/*                <Button onClick={() => {*/}
        {/*                    uploadAnnotation("ethan_mugcake_0", {"test": "a"})*/}
        {/*                }}> Save </Button>*/}
        {/*            </Box>*/}
        {/*        )*/}
        {/*    }*/}
        {/*</AnnotationContext.Consumer>*/}

    </Box>

}