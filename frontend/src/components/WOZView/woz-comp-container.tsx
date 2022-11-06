import {Box, styled} from "@mui/material";
import {AnnotationContext} from "./annotation/provider";
import MachineReasoningInitializer from "./annotation/machine-reasoning-initializer";
import {StreamView} from "../StreamDataView/LiveStream";
import {ReasoningOutputsWOZView} from "../StreamDataView/ReasoningOutputsView";
import ReplayPlayer from "./video/replay-player";
import {dataType} from "../../api/types";
import Controls from "../Controls";
import Card from "@mui/material/Card";
import TemporalOverview from "./overview/temporal-overview";
import React, {ReactElement} from "react";
import {REASONING_CHECK_STREAM} from "../../config";
import {ImageView} from './video/online-image-view';
import MachineReasoningRecorder from "./annotation/machine-reasoning-recorder";
import OnlineStreamInitializer from "./annotation/online-stream-initializer";
import ErrorAlert from "./common/error-alert";
import {AnnotationData} from "./annotation/types";


interface RecipeData {
    _id: string,
    name: string,
    ingredients: string [],
    ingredients_simple: string [],
    instructions: string [],
    steps: string [],
    steps_simple: string [],
    tools: string [],
    tools_simple: string []
}

interface WozCompContainerProps {
    state: any
    recordingID: string,
    recordingList: Array<string>,
    recipeIDList: Array<string>,
    recordingData: any,
    streamInfo: any,
    reasoningData: any,
    reasoningFrameData: any,
    recipeData: RecipeData,
    boundingBoxData: any,
    boundingBoxFrameData: any,
    clipActionData: any,
    clipActionFrameData: any,
    egovlpActionData: any,
    egovlpActionFrameData: any,
    videoPlayer: ReactElement,
    videoControls: ReactElement,
    currentTime: number,
    recipePicker: ReactElement,
    currentStep: number

}


const Container = styled("div")({});

export default function WozCompContainer({
                                             state, recordingID, recordingList, recipeIDList,
                                             recordingData, reasoningData, reasoningFrameData, recipeData,
                                             boundingBoxData, boundingBoxFrameData,
                                             egovlpActionData, egovlpActionFrameData,
                                             clipActionData, clipActionFrameData, videoPlayer,
                                             videoControls, streamInfo, currentTime, currentStep,
                                             recipePicker
                                         }: WozCompContainerProps) {

    const renderTemporalOverview = (annotationData: AnnotationData) => {
        if(annotationData.meta.mode === "offline" && recordingData && reasoningData && boundingBoxData && reasoningData.length && clipActionData){
            return (<TemporalOverview
                annotationData={annotationData}
                state={state}
                clipActionData={clipActionData}
                reasoningData={reasoningData}
                boundingBoxData={boundingBoxData}
                recordingMeta={recordingData}
            ></TemporalOverview>)
        }else if (annotationData.meta.mode === "offline" && (!reasoningData || reasoningData.length === 0)) {
            return (<ErrorAlert message={"Reasoning data is not available for this recording"}/>)
        }

    }

    return (
        <Container>
            <AnnotationContext.Consumer>
                {
                    ({annotationData, setAnnotationData}) => (
                        <div>
                            {annotationData.meta.mode === "offline" && <MachineReasoningInitializer
                            recordingMeta={recordingData} reasoningData={reasoningData}
                            annotationData={annotationData} setAnnotationData={setAnnotationData}/>}
                            {annotationData.meta.mode === "online" && streamInfo && <OnlineStreamInitializer
                                streamMeta={streamInfo}
                                annotationData={annotationData} setAnnotationData={setAnnotationData}/>}

                        </div>
                    )
                }
            </AnnotationContext.Consumer>
            <AnnotationContext.Consumer>
                {
                    ({annotationData, setAnnotationData}) => (
                        <MachineReasoningRecorder
                            currentTime={currentTime}
                            reasoningFrameData={reasoningFrameData}
                            annotationData={annotationData} setAnnotationData={setAnnotationData}/>
                    )
                }
            </AnnotationContext.Consumer>
            <Box>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                        gap: 1,
                        gridTemplateRows: 'auto',
                        gridTemplateAreas: {
                            md: `
              "H H H H H H"
              "H H H H H H"
              "M M M r r r"
              "M M M r r r"
              "N N N r r r"
              "g g g g g g"
              "g g g g g g"
              "g g g g g g"
          `,
                            xs: `
              "H H H H H H"
              "H H H H H H"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "g g g g g g"
              "a a a b b b"
              "e e e e e e"
              "c c c d d d"
          `
                        },
                    }}>
                    <Box sx={{ gridArea: 'H' }}>
                        <Box sx={{ '& > button': { mt: 2, mb: 2, mr: 2 } }}>
                            {recipePicker}
                        </Box>
                    </Box>
                    <Box sx={{ gridArea: 'r' }}>
                        <StreamView utf streamId={REASONING_CHECK_STREAM} showStreamId={false} showTime={false}>
                            {data => (<Box>{<ReasoningOutputsWOZView
                                currentTimestampValue={currentTime}
                                recipeIDList={recipeIDList}
                                clipActionFrameData={clipActionFrameData}
                                egovlpActionFrameData={egovlpActionFrameData}
                                reasoningFrameData={reasoningFrameData}
                                worldFrameData={boundingBoxFrameData}
                                state={state}
                                recordingList={recordingList}
                                currentStep={currentStep}
                                recipe={recipeData} data={JSON.parse(data)}/>}</Box>)}
                        </StreamView>
                    </Box>
                    <AnnotationContext.Consumer>
                        {({annotationData}) => (
                            <Box sx={{gridArea: 'M'}}>
                                {/*{recordingData && videoPlayer }*/}
                                {annotationData.meta.mode === "offline" && recordingData && videoPlayer}
                                { annotationData.meta.mode === "online" && <ImageView streamId='main' boxStreamId='detic:image' confidence={annotationData.perceptronParameters.objectConfidenceThreshold} debugMode={false}/>}
                            </Box>
                        )}

                    </AnnotationContext.Consumer>
                    <AnnotationContext.Consumer>
                        {({annotationData}) => (
                            <Box
                                sx={{gridArea: "N"}}
                            >
                                {annotationData.meta.mode === "offline" && videoControls}
                            </Box>
                        )}
                    </AnnotationContext.Consumer>
                    <AnnotationContext.Consumer>
                        {
                            ({annotationData}) => (
                                <Box sx={{gridArea: 'g'}}>
                                    {
                                        renderTemporalOverview(annotationData)

                                    }
                                </Box>
                            )
                        }
                    </AnnotationContext.Consumer>

                </Box>
            </Box>
        </Container>
    )
}