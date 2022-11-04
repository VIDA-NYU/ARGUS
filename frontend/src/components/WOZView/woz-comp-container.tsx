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
import {ImageView} from '../StreamDataView/ImageView';
import MachineReasoningRecorder from "./annotation/machine-reasoning-recorder";
import OnlineStreamInitializer from "./annotation/online-stream-initializer";


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
    recipePicker: ReactElement

}


const Container = styled("div")({});

export default function WozCompContainer({
                                             state, recordingID, recordingList, recipeIDList,
                                             recordingData, reasoningData, reasoningFrameData, recipeData,
                                             boundingBoxData, boundingBoxFrameData,
                                             egovlpActionData, egovlpActionFrameData,
                                             clipActionData, clipActionFrameData, videoPlayer,
                                             videoControls, streamInfo, currentTime,
                                             recipePicker
                                         }: WozCompContainerProps) {

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
                                recipe={recipeData} data={JSON.parse(data)}/>}</Box>)}
                        </StreamView>
                    </Box>
                    <AnnotationContext.Consumer>
                        {({annotationData}) => (
                            <Box sx={{gridArea: 'M'}}>
                                {/*{recordingData && videoPlayer }*/}
                                {annotationData.meta.mode === "offline" && recordingData && videoPlayer}
                                { annotationData.meta.mode === "online" && <ImageView streamId='main' boxStreamId='debug' confidence={0.5} debugMode={false}/>}
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
                                        annotationData.meta.mode === "offline" && recordingData && reasoningData && boundingBoxData && reasoningData && clipActionData && <TemporalOverview
                                            annotationData={annotationData}
                                            state={state}
                                            clipActionData={clipActionData}
                                            reasoningData={reasoningData}
                                            boundingBoxData={boundingBoxData}
                                            recordingMeta={recordingData}
                                        ></TemporalOverview>
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