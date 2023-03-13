import {interpolateBuPu} from "d3-scale-chromatic";
import {Tooltip} from "react-svg-tooltip";
import {useRef} from "react";

interface HistogramRowProps {
    transform: string,
    cellSize: number,
    actionCellHeight: number
    yAxisLabelOffsetY: number,
    yAxisLabelWidth: number,
    index: number,
    xScale: (number) => number,
    playedTimes: Array<number>,
    timedData: any
}

export default function HistogramRow({transform, cellSize, actionCellHeight,
                                      yAxisLabelOffsetY, yAxisLabelWidth,
                                      index, xScale, playedTimes, timedData}: HistogramRowProps){
    const actionRef = useRef(null);                                  
    return (
        <g
            transform={transform}
        >
            <text
                ref={actionRef}
                x={0}
                y={cellSize / 2 + yAxisLabelOffsetY}
                fontSize = {"x-small"}
            > {timedData.label.slice(0, 10)}...
            </text>
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