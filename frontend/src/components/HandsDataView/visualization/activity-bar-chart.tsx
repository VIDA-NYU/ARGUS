import {useEffect, useRef} from "react";
import * as d3 from "d3";
import {FrameMovement} from "./types";
import {max} from "d3";

const SvgWidth = 300;
const SvgHeight = 200;

interface HandsActivityBarChartProps {
    data: Array<FrameMovement>
}

function maxValue(a, b){
    if( a > b){
        return a
    }else{
        return b;
    }
}

const leftColor = "steelblue"
const rightColor = "pink"


function HandsActivityBarChart({data}: HandsActivityBarChartProps){

    const svgRef = useRef(null);
    const contentRef = useRef(null);

    const xAvisRef = useRef(null);
    const yAxisRef = useRef(null);
    const leftPathRef = useRef(null);
    const rightPathRef = useRef(null);

    const mouseHoverRef = useRef(null);
    const mouseHoverLeftCircleRef = useRef(null);
    const mouseHoverRightCircleRef = useRef(null);
    const mouseHoverTextRef = useRef(null);
    const mouseHoverTextLine0Ref = useRef(null);
    const mouseHoverTextLine1Ref = useRef(null);
    const mouseHoverTextLine2Ref = useRef(null);
    const mouseHoverTextRectRef = useRef(null);

    let marginX = 30;
    let marginY = 10;
    let contentHeight = 160;
    let contentWidth = 230;

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d=>d.frame))
        .range([0, contentWidth]);


    const yScale = d3.scaleLinear()
        .domain([0, 1.2 * d3.max(data, d=>maxValue(d.movement.left, d.movement.right))])
        .range([contentHeight, 0]);

    useEffect(() => {
        let xAxisElm = d3.select(xAvisRef.current);
        let yAxisElm = d3.select(yAxisRef.current);

        let leftPathElm = d3.select(leftPathRef.current);
        let rightPathElm = d3.select(rightPathRef.current);

        if(xAxisElm){
            xAxisElm
                .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
        }

        if(yAxisElm){
            yAxisElm.call(d3.axisLeft(yScale))
        }

        for(let i = 0; i < data.length; i++){
            let d = data[i];
        }

        if(leftPathElm){
            leftPathElm.datum(data)
                .attr("fill", "none")
                .attr("stroke", leftColor)
                .attr("stroke-width", 1.5)
                // @ts-ignore
                .attr("d", d3.line()
                    // @ts-ignore
                        .x(function(d) { return xScale(d.frame) })
                    // @ts-ignore
                        .y(function(d) { return yScale(d.movement.left) })
                )
        }
        if(rightPathElm){
            rightPathElm.datum(data)
                .attr("fill", "none")
                .attr("stroke", rightColor)
                .attr("stroke-width", 1.5)
                // @ts-ignore
                .attr("d", d3.line()
                    // @ts-ignore
                    .x(function(d) {  return xScale(d.frame) })
                    // @ts-ignore
                    .y(function(d) { return yScale(d.movement.right) })
                )
        }



    }, [xScale, yScale])


    let inferX = (mouse) => {
        const [minX, maxX] = d3.extent(data, d=>d.frame);
        const [xCord,yCord] = d3.pointer(mouse);
        const ratio = xCord / contentWidth;
        const mouseX = minX + Math.round(ratio * (maxX - minX));
        const mouseFrame = data.find(d => d.frame === mouseX).frame;
        return mouseFrame;
    }


    useEffect(() => {

        const contentElm = d3.select(contentRef.current);
        const mouseHoverElm = d3.select(mouseHoverRef.current);
        const mouseHoverLeftCircleElm = d3.select(mouseHoverLeftCircleRef.current);
        const mouseHoverRightCircleElm = d3.select(mouseHoverRightCircleRef.current);
        const mouseHoverTextElm = d3.select(mouseHoverTextRef.current);

        const mouseHoverTextLine0Elm = d3.select(mouseHoverTextLine0Ref.current)
        const mouseHoverTextLine1Elm = d3.select(mouseHoverTextLine1Ref.current)
        const mouseHoverTextLine2Elm = d3.select(mouseHoverTextLine2Ref.current);

        const mouseHoverTextRectElm = d3.select(mouseHoverTextRectRef.current);

        if(contentElm && mouseHoverElm && mouseHoverLeftCircleElm &&
            mouseHoverRightCircleElm && mouseHoverTextElm &&
            mouseHoverTextLine0Elm && mouseHoverTextLine1Elm && mouseHoverTextLine2Elm &&
            mouseHoverTextRectElm
        ) {
            contentElm.on("mouseover", function(mouse) {
                contentElm.style('display', 'block');
            })

            contentElm.on("mousemove", function (mouse){
                let mouseFrame = inferX(mouse);
                const leftValue = data.find(d => d.frame === mouseFrame).movement.left;
                const rightValue = data.find(d => d.frame === mouseFrame).movement.right;
                mouseHoverElm.attr("transform", `translate(${xScale(mouseFrame)}, 0)`);
                mouseHoverLeftCircleElm.attr("cy", yScale(leftValue));
                mouseHoverRightCircleElm.attr("cy", yScale(rightValue));
                mouseHoverTextLine0Elm.text(`frame: ${mouseFrame}`);
                mouseHoverTextLine1Elm.text(`left hand: ${leftValue.toFixed(2)}`);
                mouseHoverTextLine2Elm.text(`right hand: ${rightValue.toFixed(2)}`);
                mouseHoverTextElm
                    .attr('text-anchor', mouseFrame < (data.length) / 2 ? "start" : "end")
                    .attr("transform",  `translate(8, 30)`)
                mouseHoverTextRectElm.attr("transform", mouseFrame < (data).length / 2 ? `translate(3, 22)`: `translate(-80, 22)`);
                ;
            })
        }

    })

    return (
        <div>
            <svg ref={svgRef} width={SvgWidth} height={SvgHeight}>
                <defs>
                    <filter id="f1" x="0" y="0" width="200%" height="200%">
                        <feOffset result="offOut" in="SourceGraphic" dx="2" dy="2" />
                        <feColorMatrix result="matrixOut" in="offOut" type="matrix"
                                       values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.3 0" />
                        <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="1" />
                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />    </filter>
                </defs>
                <g
                    transform={`translate(${marginX}, ${marginY})`}
                    ref={contentRef}
                >
                    <g
                        ref={xAvisRef}
                        transform={`translate(0,${contentHeight})`}
                    >
                    </g>

                    <g
                        ref={yAxisRef}
                    ></g>

                    <path
                        ref={leftPathRef}
                    >
                    </path>

                    <path
                        ref={rightPathRef}
                    >

                    </path>

                    <g
                        ref={mouseHoverRef}
                    >
                        <rect
                            width={2}
                            x={-1}
                            height={contentHeight}
                            fill={"lightgray"}
                        >
                        </rect>

                        <circle
                            r={3}
                            stroke={leftColor}
                            ref={mouseHoverLeftCircleRef}
                            fill={"none"}
                        >
                        </circle>

                        <circle
                            r={3}
                            stroke={rightColor}
                            ref={mouseHoverRightCircleRef}
                            fill={"none"}
                        >
                        </circle>
                        <rect
                            ref={mouseHoverTextRectRef}
                            width={94}
                            height={42}
                            fill={"#fdfdfd"}
                            transform={"translate(5, 19)"}
                            filter="url(#f1)"
                            rx={3}
                        >

                        </rect

                        >
                        <text
                            ref={mouseHoverTextRef}
                            transform={"translate(36, 50)"}
                            fontSize={12}
                            textAnchor={"start"}

                        >
                            <tspan x="0" dy=".6em"
                                   ref={mouseHoverTextLine0Ref}></tspan>
                            <tspan
                                fill={leftColor}
                                x="0" dy=".8em" ref={mouseHoverTextLine1Ref}></tspan>
                            <tspan
                                fill={rightColor}
                                x="0" dy=".9em" ref={mouseHoverTextLine2Ref}></tspan>
                        </text>



                    </g>
                    <g
                        transform={"translate(190, 0)"}
                    >
                        <g transform={"translate(0, 0)"}>
                            <circle
                                fill={leftColor}
                                r={5}
                                cx={0}
                                cy={2.5}
                            ></circle>
                            <text
                                x={12}
                                y={6}
                                fontSize={12}
                            >
                                Left Hand
                            </text>
                        </g>
                        <g transform={"translate(0, 18)"}>
                            <circle
                                fill={rightColor}
                                r={5}
                                cx={0}
                                cy={2.5}
                            ></circle>
                            <text
                                x={12}
                                y={6}
                                fontSize={12}
                            >
                                Right Hand
                            </text>
                        </g>

                    </g>

                </g>
            </svg>
        </div>
    )

}

export default HandsActivityBarChart;
