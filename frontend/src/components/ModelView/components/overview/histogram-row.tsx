import {interpolateBuPu, interpolateGreys} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip";
import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import { timestampRanges } from "../utils/utils";

interface detectedItems {
    label: string,
    confidence: number
}
interface HistogramRowProps {
    transform: string,
    detectedItems : {isVideoStart: boolean, data: detectedItems [], threshold: number},
    cellSize: number,
    chartWidth: number,
    actionCellHeight: number
    yAxisLabelOffsetY: number,
    yAxisLabelWidth: number,
    index: number,
    xScale: (number) => number,
    playedTimes: Array<number>,
    timedData: any,
    selectedItem: string,
    setTimestamps: (ranges: string[][]) => void
}



export default function HistogramRow({transform, detectedItems, cellSize, chartWidth, actionCellHeight,
                                      yAxisLabelOffsetY, yAxisLabelWidth,
                                      index, xScale, playedTimes, timedData, selectedItem, setTimestamps}: HistogramRowProps){
    const rowTooltipRef = useRef(null);
    const labelRef = useRef(null);
    const tools_ingredients = {
        'cutting board': 'board',
        'butter knife': 'knife',
        'paper towel': 'paper towel',
        'flour tortilla': 'tortilla',
        'toothpicks': 'toothpicks',
        'dental floss (string)': 'dental floss',
        '~12-inch strand of dental floss': 'dental floss',
        'plate': 'plate',
        'Jar of peanut butter': 'nut butter',
        'Jar of nut butter': 'nut butter',
        'Jar of jelly / jam': 'jam',
        'Jar of jelly': 'jam'
    }
    const splitLabel = timedData.label.split(/[ :]+/);
    const shortLabel = splitLabel.length > 2 ?  splitLabel[0] + " " + splitLabel[1] : timedData.label;

    const indexDetectedItem = detectedItems.data.findIndex(item => item.label === timedData.label);

    const avgGridWidth = 20;
    let xScaleAVGConfidence = d3.scaleLinear()
        .range([0, avgGridWidth])
        .domain([0, 1]);
    let xScaleLebelsConfidence = d3.scaleLinear()
        .range([0, yAxisLabelWidth])
        .domain([0, 1]);

    const filterOutZeros = timedData.data.filter(d => d > detectedItems.threshold);
    const avgConfidence = filterOutZeros.length > 0 ? filterOutZeros.reduce((a, b) => a + b) / filterOutZeros.length : 0;
    const appearAVG = filterOutZeros.length/timedData.data.length;

    const [colorSelectedItem, setColorSelectedItem] = useState<string>("white");
    useEffect(() => {
        const mouseClickCircleElm = d3.select(labelRef.current);
        if(mouseClickCircleElm) {
            mouseClickCircleElm.on("click", function(mouse) {
                if(colorSelectedItem==="blue"){
                    setTimestamps([]);
                    setColorSelectedItem("white");
                } else {
                    const timesRanges = timestampRanges(playedTimes, timedData);
                    setTimestamps(timesRanges);
                    setColorSelectedItem("blue");
                }
            })
        }
    })

    return (
        <g transform={transform}>
            <g>
                <rect
                    x={-10}
                    y={0}
                    width= {12}
                    height={10}
                    fill={null}
                    opacity={0}
                    ref={labelRef}
                >
                </rect>
                <circle
                    cx={-6}
                    cy={4}
                    r= {3}//{xScale(playedTimes[playedTimes.length - 1])}
                    fill={colorSelectedItem}
                    stroke={"grey"}
                    strokeWidth={"0.5"}
                    ref={labelRef}
                >
                </circle>
            </g>
            <g
                fillOpacity={detectedItems.isVideoStart ? '1' : detectedItems.data.map(a => a.label).includes(timedData.label.toString()) ? "1" : '0.1'}
            >
                <g>
                    <text
                        x={0}
                        y={cellSize / 2 + yAxisLabelOffsetY}
                        fontSize = {"x-small"}
                    > {Object.keys(tools_ingredients).includes(timedData.label) ? tools_ingredients[timedData.label] : shortLabel.replace(/[-,]/g,'')}
                    </text>
                    <rect
                        x={-2}
                        y={-2}
                        width={detectedItems.isVideoStart ? 0 : detectedItems.data.map(a => a.label).includes(timedData.label) ? xScaleLebelsConfidence(detectedItems.data[indexDetectedItem].confidence) : 0}
                        height={actionCellHeight+2}
                        fill={'#F8DE7E'} //still thinking about the color we need to use here
                        fillOpacity={0.4}
                    >
                    </rect>
                </g>
                <g transform={`translate(${yAxisLabelWidth}, 0)`} >
                    {
                        playedTimes.map((playedTime, i) => {
                            return (
                                <g
                                    key={`action-${index}-cell-${i}`}
                                    transform={`translate(${xScale(playedTime)}, ${0})`}
                                >
                                    <rect
                                        x={0}
                                        y={0}
                                        width={cellSize}
                                        height={actionCellHeight}
                                        fill={interpolateBuPu(timedData.data[i])}
                                    >
                                    </rect>

                                </g>
                            )
                        })
                    }
                    {/* AVG confidence */}
                    <g transform={`translate(${chartWidth+20}, 0)`} >
                        <rect
                            x={0}
                            y={-1}
                            width={avgGridWidth}
                            height={actionCellHeight+2}
                            fill={'white'}
                            fillOpacity={1}
                            stroke="grey"
                            strokeWidth="0.1"
                        >
                        </rect>
                        <rect
                            x={0.1}
                            y={-1}
                            width={detectedItems.isVideoStart ? xScaleAVGConfidence(avgConfidence) : detectedItems.data.map(a => a.label).includes(timedData.label) ? xScaleAVGConfidence(avgConfidence) : 0}
                            height={actionCellHeight+1.9}
                            fill={interpolateBuPu(avgConfidence)}
                        >
                        </rect>
                    </g>
                    {/* Detection Coverage */}
                    <g transform={`translate(${chartWidth+20 +avgGridWidth}, 0)`} >
                        <rect
                            x={0}
                            y={-1}
                            width={avgGridWidth}
                            height={actionCellHeight+2}
                            fill={'white'}
                            fillOpacity={1}
                            stroke="grey"
                            strokeWidth="0.1"
                        >
                        </rect>
                        <rect
                            x={0.1}
                            y={-1}
                            width={detectedItems.isVideoStart ? xScaleAVGConfidence(appearAVG) : detectedItems.data.map(a => a.label).includes(timedData.label) ? xScaleAVGConfidence(appearAVG) : 0}
                            height={actionCellHeight+2}
                            fill={interpolateGreys(appearAVG)}
                        >
                        </rect>
                    </g>
                </g>

                {/* Tooltip */}
                <rect
                    x={1}
                    y={0}
                    width= {500}//{xScale(playedTimes[playedTimes.length - 1])}
                    height={actionCellHeight}
                    fill={null}
                    opacity={0}
                    ref={rowTooltipRef}
                ></rect>

                <Tooltip triggerRef={rowTooltipRef}>
                    <rect x={2} y={2} width={420} height={30} rx={.5} ry={.5} fill='#e3e3e3'/>
                    <text x={10} y={25} fontSize={20} fill='black'> {timedData.label} </text>
                </Tooltip>

            </g>
        </g>
    )
}