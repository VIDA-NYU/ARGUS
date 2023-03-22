import {interpolateBuPu, interpolateGreys} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip";
import {useRef} from "react";
import { scaleLinear } from "d3";

interface detectedItems {
    label: string,
    confidence: number
}
interface MatrixObjectsActionsProps {
    transform: string,
    detectedItems : {isVideoStart: boolean, data: detectedItems [], listActions: string[], actions: detectedItems [], threshold: number},
    cellSize: number,
    chartWidth: number,
    actionCellHeight: number
    yAxisLabelOffsetY: number,
    yAxisLabelWidth: number,
    index: number,
    xScale: (number) => number,
    playedTimes: Array<number>,
    timedData: any
}

export default function MatrixObjectsActions({transform, detectedItems, cellSize, chartWidth, actionCellHeight,
                                      yAxisLabelOffsetY, yAxisLabelWidth,
                                      index, xScale, playedTimes, timedData}: MatrixObjectsActionsProps){
    const actionRef = useRef(null);
    const tools_ingredients = {
        'cutting board': 'board',
        'butter knife': 'knife',
        'paper towel': 'napkin',
        'flour tortilla': 'tortilla',
        'toothpicks': 'toothpicks',
        'dental floss (string)': 'string',
        '~12-inch strand of dental floss': 'string',
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
    let xScaleAVGConfidence = scaleLinear()
        .range([0, avgGridWidth])
        .domain([0, 1]);
    let xScaleLebelsConfidence = scaleLinear()
        .range([0, yAxisLabelWidth])
        .domain([0, 1]);
// console.log(detectedItems);
    const filterOutZeros = timedData.data.filter(d => d > detectedItems.threshold);
    const avgConfidence = filterOutZeros.length > 0 ? filterOutZeros.reduce((a, b) => a + b) / filterOutZeros.length : 0;

    const appearAVG = filterOutZeros.length/timedData.data.length;

    console.log(detectedItems.actions);
    return (
        <g
            transform={transform}
            fillOpacity={detectedItems.isVideoStart ? '1' : detectedItems.data.map(a => a.label).includes(timedData.label) ? "1" : '0.1'}
        >
            <text
                ref={actionRef}
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
            <g
                transform={`translate(${yAxisLabelWidth}, 0)`}
            >

                {/* {
                    detectedItems.actions.map((playedTime, i) => {
                        return (
                            // <span>{playedTime.label}</span>
                            <g
                                key={`action-${index}-cell-${i}`}
                                transform={`translate(${4}, ${0})`} //xScale(playedTime)
                            >
                                <rect
                                    x={0}
                                    y={0}
                                    width={cellSize}
                                    height={actionCellHeight}
                                    fill={interpolateBuPu(playedTime.confidence)}


                                >
                                </rect>

                            </g>
                        )
                    })
                } */}
                {/* AVG confidence */}
                <g
                    transform={`translate(${chartWidth+20}, 0)`}
                >
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
            </g>
            {/* Detection Coverage */}
            <g
                transform={`translate(${chartWidth+138.3}, 0)`}
            >
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

            {/* Additional */}
            <rect
                x={0}
                y={0}
                width={xScale(playedTimes[playedTimes.length - 1])}
                height={actionCellHeight}
                fill={null}
                opacity={0}
                ref={actionRef}
            >

            </rect>

            <Tooltip triggerRef={actionRef}>
                <rect x={2} y={2} width={420} height={30} rx={.5} ry={.5} fill='#e3e3e3'/>
                <text x={10} y={25} fontSize={20} fill='black'> {timedData.label} </text>
            </Tooltip>


        </g>
    )
}