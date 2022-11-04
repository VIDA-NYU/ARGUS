import {styled} from "@mui/material";
import {useEffect, useRef} from "react";
import {scaleLinear, scaleBand, axisBottom, select} from "d3";
import {extractIndividualActionData, preprocessTimestampData} from "./preprocess";
import {schemeGnBu, interpolateTurbo, interpolateBuPu} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip"
import Card from "@mui/material/Card";
import ActionRow from "./action-row";
import {generateHumanAnnotationTemporalData} from "../annotation/utils";

const Container = styled(Card)({})

const xCellNumber = 50;
const chartWidth = 1440;
const chartHeight = 280;
const cellMargin = 5;

function computeCellSize(cellNumber, width) {
    let cellSize = 18;
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

const yMargin = 20;
const xMargin = 50;


const chartErrorNormalColor = "#e3e3e3";
const chartErrorHighlightColor = "red";
const yAxisLabelWidth = 70;
const yAxisLabelOffsetY = 6;

const xAxisY = 240;


interface HeatmapCellWithLabelProps {
    x: number, y: number, cellSize: number,
    rectFill: string, textFill: string, label
}

const HeatmapCellWithLabel = ({x, y, cellSize, label, rectFill, textFill}: HeatmapCellWithLabelProps) => {
    return (
        <g
            transform={`translate(${x}, ${y})`}
        >
            <rect
                x={0}
                y={0}
                width={cellSize}
                height={cellSize}
                fill={rectFill}
            >
            </rect>
            <text
                x={cellSize / 2 }
                y={cellSize / 2 + yAxisLabelOffsetY}
                fill={textFill}
                textAnchor={"middle"}
            >
                {label}
            </text>
        </g>
    )
}

export default function TemporalOverview({reasoningData, boundingBoxData,
                                             clipActionData, recordingMeta,
                                             state, annotationData}) {
    const visRef = useRef(null);
    const xAxisRef = useRef(null);
    const {cellSize, cellMargin} = computeCellSize(xCellNumber, chartWidth);
    let xScale = scaleLinear()
        .range([0, chartWidth])
        .domain([0, 1]);

    let humanReasoningData = generateHumanAnnotationTemporalData(annotationData, reasoningData);

    const playedTimes = generatePlayedTimes(xCellNumber);

    const reasoningCellData = preprocessTimestampData(reasoningData, recordingMeta, playedTimes);
    const humanCellData = preprocessTimestampData(humanReasoningData, recordingMeta, playedTimes);

    const clipActionTimedData = preprocessTimestampData(clipActionData, recordingMeta, playedTimes)
    const individualActionDataList = extractIndividualActionData(clipActionTimedData);

    const actionLabelRef0 = useRef(null);
    const actionLabelRef1 = useRef(null);
    const actionLabelRef2 = useRef(null);
    const actionLabelRef3 = useRef(null);
    const actionCellHeight = 5;

    const actionLabelRefs = [actionLabelRef0, actionLabelRef1, actionLabelRef2, actionLabelRef3];

    useEffect(() => {
        if (xAxisRef.current) {
            let xAxis = axisBottom(xScale);
            select(xAxisRef.current).call(xAxis)
        }
    }, []);

    let renderAction = (timedData, index) => {
        let transform = `translate(${0}, ${index * actionCellHeight * 1.2})`;
        return (
            <ActionRow transform={transform} cellSize={cellSize}
                       yAxisLabelOffsetY={yAxisLabelOffsetY} yAxisLabelWidth={yAxisLabelWidth}
                       index={index} xScale={xScale}
                       actionCellHeight={actionCellHeight}
                       playedTimes={playedTimes} timedData={timedData}></ActionRow>
        )
    }

    let renderActions = (timedDataList) => {
        return (<g
            transform={`translate(0, 120)`}
        >
            <text
                x={0}
                y={cellSize / 2 + yAxisLabelOffsetY + actionCellHeight * 1.2 * timedDataList.length/2}
            >
                Actions
            </text>
            <g>
                {
                    timedDataList.map((timedData, i) => {
                        return renderAction(timedData, i);
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
                    <g
                        transform={`translate(${0}, 20)`}
                    >
                        <text
                            x={0}
                            y={cellSize / 2 + yAxisLabelOffsetY}
                        >Error
                        </text>
                        <g
                            transform={`translate(${yAxisLabelWidth}, 0)`}
                        >

                            {
                                playedTimes.map((playedTime, i) => {
                                    return (
                                        <rect
                                            x={xScale(playedTime)}
                                            y={0}
                                            width={cellSize}
                                            height={cellSize}
                                            fill={reasoningCellData[i].error_status ? chartErrorHighlightColor : chartErrorNormalColor}
                                        >
                                        </rect>
                                    )
                                })
                            }
                        </g>


                    </g>

                    <g
                        transform={`translate(${0}, 50)`}
                    >
                        <text
                            x={0}
                            y={cellSize / 2 + yAxisLabelOffsetY}
                        > Step
                        </text>
                        <g
                            transform={`translate(${yAxisLabelWidth}, 0)`}
                        >

                            {
                                playedTimes.map((playedTime, i) => {
                                    return (
                                        <HeatmapCellWithLabel
                                            x={xScale(playedTime)}
                                            y={0}
                                            cellSize={cellSize}
                                            rectFill={interpolateBuPu(reasoningCellData[i].step_id / 10 + 0.25)}
                                            textFill={reasoningCellData[i].step_id < 4 ? "#333333" : "white"}
                                            label={reasoningCellData[i].step_id.toString()}
                                        />

                                    )
                                })
                            }
                        </g>


                    </g>

                    <g
                        transform={`translate(${0}, 80)`}
                    >
                        <text
                            x={0}
                            y={cellSize / 2 + yAxisLabelOffsetY}
                        > Human
                        </text>
                        <g
                            transform={`translate(${yAxisLabelWidth}, 0)`}
                        >

                            {
                                playedTimes.map((playedTime, i) => {
                                    return (
                                        <HeatmapCellWithLabel
                                            x={xScale(playedTime)}
                                            y={0}
                                            cellSize={cellSize}
                                            rectFill={interpolateBuPu(reasoningCellData[i].step_id / 10 + 0.25)}
                                            textFill={reasoningCellData[i].step_id < 4 ? "#333333" : "white"}
                                            label={reasoningCellData[i].step_id.toString()}
                                        />
                                    )
                                })
                            }
                        </g>


                    </g>

                    {renderActions(individualActionDataList)}

                    <g
                        transform={`translate(${yAxisLabelWidth}, ${xAxisY})`}
                        ref={xAxisRef}>

                    </g>
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