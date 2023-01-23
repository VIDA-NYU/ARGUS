import LinearProgress from '@mui/material/LinearProgress';
import {useRef, useState, useLayoutEffect} from "react"
import { deepOrange, deepPurple, blue, blueGrey } from '@mui/material/colors';

interface RecipeProgressProps {
    currentStep: number,
    numberSteps: number
}

const barWidth = 10;

export default function RecipeProgressComp({currentStep, numberSteps}: RecipeProgressProps){

    const svgRef = useRef();


    let progressValue = currentStep / numberSteps;

    return (
        <svg ref={svgRef} height={"100%"} width={"20"}>
            <g>
                <rect
                    x={0}
                    y={0}
                    width={barWidth}
                    height={"100%"}
                    fill={blueGrey[100]}
                    rx={5}
                >

                </rect>
                <rect
                    x={0}
                    y={0}
                    width={barWidth}
                    height={`${Math.floor(progressValue * 100)}%`}
                    fill={blueGrey[500]}
                    rx={5}
                >
                </rect>
            </g>
        </svg>

    )
}