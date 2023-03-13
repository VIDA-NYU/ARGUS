import {styled} from "@mui/material";
import {useEffect, useRef} from "react";
import {scaleLinear, scaleBand, axisBottom, select} from "d3";
import {extractIndividualActionData, extractIndividualBoundingBoxData, preprocessTimestampData} from "./preprocess";
import {schemeGnBu, interpolateTurbo, interpolateBuPu} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip"
import Card from "@mui/material/Card";
import HistogramRow from "./histogram-row";
import {generateHumanAnnotationTemporalData} from "../annotation/utils";

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

export default function TemporalOverview({reasoningData, boundingBoxData,
                                             clipActionData, egovlpActionData, recordingMeta,
                                             state, annotationData}) {
    const visRef = useRef(null);
    const xAxisRef = useRef(null);

    // create as many bins as seconds (duration of the session/video in seconds)
    xCellNumber = Math.floor(recordingMeta.duration_secs);

    const {cellSize, cellMargin} = computeCellSize(xCellNumber, chartWidth);

    useEffect(() => {
        if (xAxisRef.current) {
            let xAxis = axisBottom(xScale);
            select(xAxisRef.current).call(xAxis)
        }
    }, []);

    let xScale = scaleLinear()
        .range([0, chartWidth])
        .domain([0, 1]);
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
    // console.log("boundingBoxTimedData");
    // console.log(boundingBoxTimedData);
    const individualBoundingBoxList = boundingBoxStatus && extractIndividualBoundingBoxData(boundingBoxTimedData);

    const cellHeight = 10; //5
    let computeContainerHeight = (a, b) => {
        return a * 1.2 * (b.length ? b.length : 0);
     }
    const actionContainerHeight = computeContainerHeight(cellHeight, individualActionDataList);
    const objectContainerHeight = computeContainerHeight(cellHeight, individualBoundingBoxList);

    const chartHeight = marginTop + actionContainerHeight + objectContainerHeight + 40; // 120

    const xAxisY = chartHeight - 20;

    let renderHistogramRow = (timedData, index) => {
        let transform = `translate(${0}, ${index * cellHeight * 1.2})`;
        return (
            <HistogramRow
                key={`action-row-${index}`}
                transform={transform} cellSize={cellSize}
                yAxisLabelOffsetY={yAxisLabelOffsetY} yAxisLabelWidth={yAxisLabelWidth}
                index={index} xScale={xScale}
                actionCellHeight={cellHeight}
                playedTimes={playedTimes} timedData={timedData}></HistogramRow>
        )
    }

    let renderActions = (timedDataList) => {
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
                        return renderHistogramRow(timedData, i);
                    })
                }
            </g>

        </g>)
    }
    let renderObjects = (timedDataList) => {
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
                        return renderHistogramRow(timedData, i);
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
                    {(clipActionStatus || egovlpActionStatus) && renderActions(individualActionDataList)}
                    {/* Objects Temporal Overview */}
                    {boundingBoxStatus && renderObjects(individualBoundingBoxList)}
                    
                    {/* X-axis labels */}
                    <g
                        transform={`translate(${yAxisLabelWidth}, ${xAxisY})`}
                        ref={xAxisRef}>
                    </g>
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
