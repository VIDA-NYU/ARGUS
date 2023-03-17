import {interpolateBuPu} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip";
import {useRef} from "react";

interface detectedItems {
    label: string,
    confidence: number
}
interface HistogramRowProps {
    transform: string,
    detectedItems : {isVideoStart: boolean, data: detectedItems []},
    cellSize: number,
    actionCellHeight: number
    yAxisLabelOffsetY: number,
    yAxisLabelWidth: number,
    index: number,
    xScale: (number) => number,
    playedTimes: Array<number>,
    timedData: any
}

export default function HistogramRow({transform, detectedItems, cellSize, actionCellHeight,
                                      yAxisLabelOffsetY, yAxisLabelWidth,
                                      index, xScale, playedTimes, timedData}: HistogramRowProps){
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
                width={detectedItems.isVideoStart ? 0 : detectedItems.data.map(a => a.label).includes(timedData.label) ? detectedItems.data[indexDetectedItem].confidence*yAxisLabelWidth : 0}
                height={actionCellHeight+2}
                fill={'#F8DE7E'} //still thinking about the color we need to use here
                fillOpacity={0.4}
            >
            </rect>
            <g
                transform={`translate(${yAxisLabelWidth}, 0)`}
            >

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
            </g>
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