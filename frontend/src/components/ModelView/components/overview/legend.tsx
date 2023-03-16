import {interpolateBuPu} from "d3-scale-chromatic";
import { range } from "d3";

interface HistogramRowProps {
    title: string,
    rangeFromTo: number [],
    chartWidth: number,
    cellSize: number,
    yAxisLabelOffsetY: number,
    yAxisLabelWidth: number,
}

export default function Legend({title, rangeFromTo, chartWidth, cellSize, yAxisLabelOffsetY, yAxisLabelWidth}: HistogramRowProps){                                
    const colorConfidence =  range(0, 1, 0.001);
    return (            
        <g
            transform={`translate(${chartWidth - 60}, ${-20})`}
        >
            <text
                x={55}
                y={cellSize / 2 + yAxisLabelOffsetY-8}
                fontSize = {"x-small"}
            > {title}
            </text>
            <text
                x={55}
                y={cellSize / 2 + yAxisLabelOffsetY  + 8}
                fontSize = {".6em"}
            > {rangeFromTo[0]}
            </text>
            <text
                x={108}
                y={cellSize / 2 + yAxisLabelOffsetY + 8}
                fontSize = {".6em"}
            > {rangeFromTo[1]}
            </text>
            <g
                transform={`translate(${yAxisLabelWidth-4}, 0)`}
            >
                {
                    colorConfidence.map((i, j) => {
                        return (
                            <g
                                key={`action-${j}-cell-${j}`}
                                transform={`translate(${i*68}, 2)`}
                            >
                                <rect
                                    x={0}
                                    y={0}
                                    width={1}
                                    height={5}
                                    fill={interpolateBuPu(i)}
                                >
                                </rect>

                            </g>
                        )
                    })
                }
            </g>
        </g>
    )
}