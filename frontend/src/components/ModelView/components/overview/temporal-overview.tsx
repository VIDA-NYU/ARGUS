import {styled} from "@mui/material";
import {useEffect, useRef} from "react";
import d3, {scaleLinear, scaleBand, axisBottom, select, timeFormat, timeMinute, tickFormat, range} from "d3";
import {extractAllStepLabels, extractIndividualActionData, extractIndividualBoundingBoxData, extractIndividualReasoningData, preprocessTimestampData} from "./preprocess";
import {schemeGnBu, interpolateTurbo, interpolateBuPu} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip"
import Card from "@mui/material/Card";
import HistogramRow from "./histogram-row";
import {generateHumanAnnotationTemporalData, setNewObjectConfidenceThreshold} from "../annotation/utils";
import { preprocessFrameBoundingBoxData, syncWithVideoTime } from "../video/utils/wrapper";
import Legend from "./legend";
import ObjectConfidenceThresholdAdjuster from "../object-comps/object-confidence-threshold-adjuster";
// import * from "color-legend-element";

const Container = styled(Card)({})

let xCellNumber = 420; //50
const chartWidth = 305; //1440
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
const yMargin = 32; //20
const xMargin = 10;  //50
const xMarginLeft = 15;  //50
const xMarginRight = 95;  //50
const marginTop = 40;


const chartErrorNormalColor = "#e3e3e3";
const chartErrorHighlightColor = "red";
const yAxisLabelWidth = 98; //70 // label width
const yAxisLabelOffsetY = 6;

export default function TemporalOverview({currentTime, boundingBoxFrameData, reasoningFrameData, reasoningData, boundingBoxData,
                                             clipActionData, egovlpActionData, clipActionFrameData, egovlpActionFrameData, recordingMeta,
                                             state, annotationData}) {
    const visRef = useRef(null);
    const xAxisRef = useRef(null);

    const thresholdObjectDetection = annotationData.perceptronParameters.objectConfidenceThreshold;
    const thresholdActionDetection = annotationData.perceptronParameters.objectConfidenceThreshold;

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

    // reasoning outputs - steps
    let reasoningStatus = reasoningData && reasoningData.length !== 0;
    const reasoningTimedData = reasoningStatus && preprocessTimestampData(reasoningData, recordingMeta, playedTimes, state.totalDuration);
    const individualReasoningList = reasoningStatus && extractIndividualReasoningData(reasoningTimedData);
    
    // find detected actions and objects
    const detectedObjects = boundingBoxFrameData && boundingBoxFrameData.data ? boundingBoxFrameData.data.filter(d => d.confidence > thresholdObjectDetection).map(d => ({'label': d.label, 'confidence': d.confidence}) ) : [];
    const detectedActions = clipActionStatus ?
                            clipActionFrameData && Object.keys(clipActionFrameData).length > 0 ? Object.keys(clipActionFrameData).filter((key) => clipActionFrameData[key]> thresholdActionDetection).map(d => ({'label': d, 'confidence': clipActionFrameData[d]}) )  : []
                            :
                            egovlpActionFrameData && Object.keys(egovlpActionFrameData).length > 0 ? Object.keys(egovlpActionFrameData).filter((key) => egovlpActionFrameData[key]> thresholdActionDetection).map(d => ({'label': d, 'confidence': egovlpActionFrameData[d]}) ) : [];
    const detectedSteps = (reasoningStatus && reasoningFrameData) ? [{'label': reasoningFrameData.step_id.toString(), 'confidence': 1}] : [];

    const cellHeight = 10; //5
    let computeContainerHeight = (a, b) => {
        return a * 1.2 * (b.length ? b.length : 0);
     }
     
    const actionContainerHeight = computeContainerHeight(cellHeight, individualActionDataList);
    const objectContainerHeight = computeContainerHeight(cellHeight, individualBoundingBoxList);
    const stepContainerHeight = computeContainerHeight(cellHeight, individualReasoningList);


    const chartHeight = marginTop + actionContainerHeight + objectContainerHeight + stepContainerHeight + 70; // 120

    const xAxisY = chartHeight - 20;

    let renderHistogramRow = (timedData, index, detectedItems) => {
        let transform = `translate(${0}, ${index * cellHeight * 1.2})`;
        return (
            <HistogramRow
                key={`action-row-${index}`}
                detectedItems={detectedItems}
                transform={transform} cellSize={cellSize} chartWidth={chartWidth}
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
            {/* <text
                x={chartWidth + xMarginLeft + 94}
                y={-4}
                fontSize = {".25em"}
                text-anchor="middle"
                transform="translate(440,-450)  rotate(90)"
            > Avg-Confidence
            </text> */}
            <text
                x={chartWidth + xMarginLeft + 94}
                y={-4}
                fontSize = {".45em"}
                textAnchor="middle"
                dominantBaseline="central"
                transform="rotate(-30, 175, -838)"
            >
                <tspan x="-12" dy=".6em">Average</tspan>
                <tspan x="-8" dy="1.0em">Confidence</tspan>
            </text>
            <text
                x={chartWidth + xMarginLeft + 94}
                y={-4}
                fontSize = {".45em"}
                textAnchor="middle"
                dominantBaseline="central"
                transform="rotate(-30, 193, -880)"
            >
                <tspan x="-5" dy=".6em">Detection</tspan>
                <tspan x="-4" dy="1.0em">Coverage</tspan>
            </text>
            <g>
                {
                    timedDataList.map((timedData, i) => {
                        return renderHistogramRow(timedData, i, {"isVideoStart": state.played === 0, 'data': detectedItems, 'threshold': thresholdActionDetection});
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
                        return renderHistogramRow(timedData, i, {"isVideoStart": state.played === 0, 'data': detectedItems, 'threshold': thresholdObjectDetection});
                    })
                }
            </g>

        </g>)
    }
    let renderSteps = (timedDataList, detectedItems) => {
        return (<g
            transform={`translate(0, ${marginTop + actionContainerHeight+objectContainerHeight + 30})`} // 120
        >
            <text
                x={0}
                y={-5}
            >
                Steps
            </text>
            <g>
                {
                    timedDataList.map((timedData, i) => {
                        return renderHistogramRow(timedData, i, {"isVideoStart": state.played === 0, 'data': detectedItems, 'threshold': 0});
                    })
                }
            </g>

        </g>)
    }
    
    return (
        <Container>
            {reasoningFrameData && state.played > 0 && <p style={{marginBottom:"-8px"}} text-indent="50px" line-height= "0.8"> <small><b>Step {reasoningFrameData.step_id}:</b> {reasoningFrameData.step_description}</small></p>}
            <br></br>
            <svg ref={visRef}
                 width={chartWidth + xMarginLeft + xMarginRight + yAxisLabelWidth}
                 height={chartHeight + yMargin}
            >
                <g
                    transform={`translate(${xMarginLeft}, ${yMargin})`}
                >
                    {/* Actions Temporal Overview */}
                    {(clipActionStatus || egovlpActionStatus) && renderActions(individualActionDataList, detectedActions)}
                    {/* Objects Temporal Overview */}
                    {boundingBoxStatus && renderObjects(individualBoundingBoxList, detectedObjects)}
                    {reasoningStatus && renderSteps(individualReasoningList, detectedSteps)}
                    
                    {/* X-axis labels */}
                    <g
                        transform={`translate(${yAxisLabelWidth}, ${xAxisY})`}
                        ref={xAxisRef}>
                    </g>
                    <text
                        transform={`translate(${chartWidth - 10}, ${xAxisY - 18})`}
                        fontSize={"x-small"}
                        x={yAxisLabelWidth/2}
                        y={15}
                    >
                        Time (mm:ss)
                    </text>
                    <Legend type={'confidence'} legendXPos={55} legendWidth={50} title={"Confidence"} rangeFromTo={[0,1]} chartWidth={chartWidth-80+60} cellSize={cellSize} yAxisLabelOffsetY={yAxisLabelOffsetY} />
                    <Legend legendXPos={60} legendWidth={44} title={"Coverage"} rangeFromTo={[0,1]} chartWidth={chartWidth+60} cellSize={cellSize} yAxisLabelOffsetY={yAxisLabelOffsetY} />


                    {/* Tracking time: Draw a vertical line that intersect both actions and objects charts */}
                    <g transform={`translate(${yAxisLabelWidth + xScale(state.played)}, ${0})`}>
                        <line
                            x1={0}
                            y1={0}
                            x2={0}
                            y2={xAxisY}
                            stroke="grey"
                            strokeWidth="0.7"
                            strokeDasharray={"4 1"}
                        ></line>
                    </g>
                </g>

            </svg>
        </Container>
    )
}
