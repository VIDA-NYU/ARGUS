import {styled} from "@mui/material";
import {useEffect, useRef} from "react";
import d3, {scaleLinear, scaleBand, axisBottom, select, timeFormat, timeMinute, tickFormat} from "d3";
import {extractIndividualActionData, extractIndividualBoundingBoxData, preprocessTimestampData} from "./preprocess";
import {schemeGnBu, interpolateTurbo, interpolateBuPu} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip"
import Card from "@mui/material/Card";
import HistogramRow from "./histogram-row";
import {generateHumanAnnotationTemporalData} from "../annotation/utils";
import { preprocessFrameBoundingBoxData, syncWithVideoTime } from "../video/utils/wrapper";

const Container = styled(Card)({})

let xCellNumber = 420; //50
const chartWidth = 420; //1440
const cellMargin = 1; // 5

function computeCellSize(cellNumber, width) {
    let cellSize = 2; // 18
    return {
        cellSize, cellMargin
    }
}

function generatePlayedTimes(cellNumber) {
    let result = [];
    for (let i = 0; i <= cellNumber; i++) {
        result.push(i / cellNumber);
    }
    return result
}

// chart margins
const yMargin = 2; //20
const xMargin = 10;  //50
const marginTop = 40;


const chartErrorNormalColor = "#e3e3e3";
const chartErrorHighlightColor = "red";
const yAxisLabelWidth = 60; //70 // label width
const yAxisLabelOffsetY = 6;

export default function TemporalOverview({currentTime, boundingBoxFrameData, reasoningFrameData, reasoningData, boundingBoxData,
                                             clipActionData, egovlpActionData, clipActionFrameData, egovlpActionFrameData, recordingMeta,
                                             state, annotationData}) {
    const visRef = useRef(null);
    const xAxisRef = useRef(null);

    // create as many bins as seconds (duration of the session/video in seconds)
    xCellNumber = Math.floor(recordingMeta.duration_secs);

    const {cellSize, cellMargin} = computeCellSize(xCellNumber, chartWidth);

    useEffect(() => {
        if (xAxisRef.current) {
            let xAxis = axisBottom(xScaleTimeFormat)
            .tickFormat((d:number) => timeFormat('%-M:%-S')(new Date(d * 1000) ));
            select(xAxisRef.current).call(xAxis)
        }
    }, [state.totalDuration]);

    let xScale = scaleLinear()
        .range([0, chartWidth])
        .domain([0, 1]);

    let xScaleTimeFormat = scaleLinear()
        .range([0, chartWidth])
        .domain([0, Math.floor(state.totalDuration)]);

    // if(!reasoningData){
    //     return (<div></div>)
    // }
    // let humanReasoningData = generateHumanAnnotationTemporalData(annotationData, reasoningData);

    const playedTimes = generatePlayedTimes(xCellNumber);

    // const reasoningCellData = preprocessTimestampData(reasoningData, recordingMeta, playedTimes, state.totalDuration);
    // const humanCellData = preprocessTimestampData(humanReasoningData, recordingMeta, playedTimes, state.totalDuration);
    let clipActionStatus = clipActionData && clipActionData.length !== 0;
    let egovlpActionStatus = egovlpActionData && egovlpActionData.length !== 0;

    let actionTimedData, individualActionDataList = [];
    if (clipActionStatus) {
        actionTimedData = clipActionStatus  && preprocessTimestampData(clipActionData, recordingMeta, playedTimes, state.totalDuration);
        individualActionDataList = clipActionStatus  ? extractIndividualActionData(actionTimedData) : [];
    } else {
        actionTimedData = egovlpActionStatus  && preprocessTimestampData(egovlpActionData, recordingMeta, playedTimes, state.totalDuration);
        individualActionDataList = egovlpActionStatus  ? extractIndividualActionData(actionTimedData) : [];
    }
    // bounding box
    let boundingBoxStatus = boundingBoxData && boundingBoxData.length !== 0;
    const boundingBoxTimedData = boundingBoxStatus && preprocessTimestampData(boundingBoxData, recordingMeta, playedTimes, state.totalDuration);
    const individualBoundingBoxList = boundingBoxStatus && extractIndividualBoundingBoxData(boundingBoxTimedData);

    // find detected actions and objects
    const detectedObjects = boundingBoxFrameData && boundingBoxFrameData.data ? boundingBoxFrameData.data.filter(d => d.confidence > annotationData.perceptronParameters.objectConfidenceThreshold).map(d => d.label) : [];
    const detectedActions = clipActionStatus ?
                            clipActionFrameData && Object.keys(clipActionFrameData).length > 0 ? Object.keys(clipActionFrameData).filter((key) => clipActionFrameData[key]> 0.1)  : []
                            :
                            egovlpActionFrameData && Object.keys(egovlpActionFrameData).length > 0 ? Object.keys(egovlpActionFrameData).filter((key) => egovlpActionFrameData[key]> 0.1) : [];

    const cellHeight = 10; //5
    let computeContainerHeight = (a, b) => {
        return a * 1.2 * (b.length ? b.length : 0);
     }
    const actionContainerHeight = computeContainerHeight(cellHeight, individualActionDataList);
    const objectContainerHeight = computeContainerHeight(cellHeight, individualBoundingBoxList);

    const chartHeight = marginTop + actionContainerHeight + objectContainerHeight + 40; // 120

    const xAxisY = chartHeight - 20;

    let renderHistogramRow = (timedData, index, detectedItems) => {
        let transform = `translate(${0}, ${index * cellHeight * 1.2})`;
        return (
            <HistogramRow
                key={`action-row-${index}`}
                detectedItems={{"isVideoStart": state.played === 0, 'data': detectedItems}}
                transform={transform} cellSize={cellSize}
                yAxisLabelOffsetY={yAxisLabelOffsetY} yAxisLabelWidth={yAxisLabelWidth}
                index={index} xScale={xScale}
                actionCellHeight={cellHeight}
                playedTimes={playedTimes} timedData={timedData}></HistogramRow>
        )
    }

    let renderActions = (timedDataList, detectedItems) => {
        return (<g
            transform={`translate(0, 15)`} //120
        >
            <text
                x={0}
                y={-5}
            >
                Actions
            </text>
            <g>
                {
                    timedDataList.map((timedData, i) => {
                        return renderHistogramRow(timedData, i, detectedItems);
                    })
                }
            </g>

        </g>)
    }
    let renderObjects = (timedDataList, detectedItems) => {
        return (<g
            transform={`translate(0, ${marginTop + actionContainerHeight})`} // 120
        >
            <text
                x={0}
                y={-5}
            >
                Objects
            </text>
            <g>
                {
                    timedDataList.map((timedData, i) => {
                        return renderHistogramRow(timedData, i, detectedItems);
                    })
                }
            </g>

        </g>)
    }

    return (
        <Container>
            <svg ref={visRef}
                 width={chartWidth + xMargin * 2 + yAxisLabelWidth}
                 height={chartHeight + yMargin}
            >
                <g
                    transform={`translate(${xMargin}, ${yMargin})`}
                >
                    {/* Actions Temporal Overview */}
                    {(clipActionStatus || egovlpActionStatus) && renderActions(individualActionDataList, detectedActions)}
                    {/* Objects Temporal Overview */}
                    {boundingBoxStatus && renderObjects(individualBoundingBoxList, detectedObjects)}
                    
                    {/* X-axis labels */}
                    <g
                        transform={`translate(${yAxisLabelWidth}, ${xAxisY})`}
                        ref={xAxisRef}>
                    </g>
                    <text
                        transform={`translate(${chartWidth - 30}, ${xAxisY - 18})`}
                        fontSize={"x-small"}
                        x={yAxisLabelWidth/2}
                        y={15}
                    >
                        Time (mm:ss)
                    </text>
                    {/* Tracking time: Draw a vertical line that intersect both actions and objects charts */}
                    <g transform={`translate(${yAxisLabelWidth + xScale(state.played)}, ${0})`}>
                        <rect
                            x={0}
                            y={0}
                            width={2}
                            height={xAxisY}
                        ></rect>
                    </g>
                </g>

            </svg>
        </Container>
    )
}
