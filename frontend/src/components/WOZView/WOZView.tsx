import React, {useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, Paper, Typography, Chip} from '@mui/material';
import {useToken} from '../../api/TokenContext';
import {Login} from '../RecipesView';
import {DETIC_IMAGE_STREAM, MAIN_STREAM, REASONING_CHECK_STREAM, TEST_PASS, TEST_USER} from '../../config';
import {useGetRecipeInfo, useGetRecording, useCurrentRecipe, useGetRecipes, useGetAllRecordings} from '../../api/rest';
import {StreamView} from '../StreamDataView/LiveStream';
import {ImageView} from '../StreamDataView/ImageView';
import {ReasoningOutputsView, ReasoningOutputsWOZView} from '../StreamDataView/ReasoningOutputsView';
import {MediaState} from "../HistoricalDataView";
import {dataType} from "../../api/types";
import VideoDataView from "../VideoDataView/VideoDataView";
import ReplayPlayer from "./video/replay-player";
import {onProgressType} from "../VideoDataView/VideoCard/VideoCard";
import Controls from "../Controls";
import screenful from "screenfull";
import {format, formatTotalDuration} from "../Helpers";
import {ClipOutputsView} from "../StreamDataView/PerceptionOutputsView";
import {useVideoTime} from "./utils/video-time";
import {getActionData, useGetRecordingJson} from "./utils/rest";
import {MemoryReplayView} from "../memory-view/memory-replay-view";
import TemporalOverview from "./overview/temporal-overview";
import Card from "@mui/material/Card";
import {AnnotationContext, AnnotationProvider, useAnnotationContext} from "./annotation/provider";
import {initializeAnnotationDataWithMachineReasoning, isAnnotationEmpty} from "./annotation/utils";
import MachineReasoningInitializer from "./annotation/machine-reasoning-initializer";
import WozDataConsumer from "./woz-data-consumer";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



function WOZView() {





    const {token, fetchAuth} = useToken();
    // const {response: recipeData} = useGetRecipeInfo(token, fetchAuth, "mugcake");

    return (
        <AnnotationProvider>
            <AnnotationContext.Consumer>
                {({annotationData, setAnnotationData}) => (
                    <WozDataConsumer
                        annotationData={annotationData}
                        setAnnotationData={setAnnotationData}
                    />
                )}
            </AnnotationContext.Consumer>


        </AnnotationProvider>
    )
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const MainVideo = () => {
    const {token} = useToken();
    return token ? <WOZView/> : <Login username={TEST_USER} password={TEST_PASS}/>
}

export default WOZView;
