import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {FrameMovement} from "./types";
import {max} from "d3";

const SvgWidth = 300;
const SvgHeight = 200;

interface IMUActivityBarChartProps {
    data: Array<FrameMovement>
}

function maxValue(a, b, c){
    if( a > b && a > c){
        return a
    }else if ( b > a && b > c){
        return b
    }else{
        return c;
    }
}

function minValue(a, b, c){
    if( a < b && a < c){
        return a
    }else if ( b < a && b < c){
        return b
    }else{
        return c;
    }
}

const xColor = "steelblue"
const yColor = "orange"
const zColor = "green"
const taskColor = "darkgray"


function computePercentage(d, index, data){
    return Math.round(100 * d.frame/data.length)
}

function IMUActivityBarChart({data, }: IMUActivityBarChartProps){

    const svgRef = useRef(null);
    const contentRef = useRef(null);
    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);
    const xPathRef = useRef(null);
    const yPathRef = useRef(null);
    const zPathRef = useRef(null);
    const taskPathRef = useRef(null);

    const taskStartTimestepsCoffeeTest1 = [0.967, 4.352, 8.221, 10.881, 11.364, 12.090, 12.332, 18.861, 20.070, 23.455, 31.192, 58.274, 59.483, 60.692, 94.545];
    const taskStartTimestepsCoffeeTest2 = [0.908, 4.315, 9.084, 12.264, 12.718, 12.945, 14.535, 21.575, 23.620, 27.253, 44.060, 59.050, 60.185, 60.866, 96.068];

    const [ scales, setScales ] = useState({});
    const [ recordingName, setRecordingName ] = useState('');

    useEffect( () => {

        if(data.length > 0){

            console.log("entered activity bar chart")
            let recordingNameArr = data.pop();
            let recordingName = String(recordingNameArr[0]);
            setRecordingName(recordingName);

            let marginX = 30;
            let marginY = 10;
            let contentHeight = 160;
            let contentWidth = 230;
        
            var xCol = data.map(function(value,index) { return value[0]; });
            var yCol = data.map(function(value,index) { return value[1]; });
            var zCol = data.map(function(value,index) { return value[2]; });
            var tCol = data.map(function(value,index) { return value[3]; });
        
            let xExtent = d3.extent(xCol);
            let yExtent = d3.extent(yCol);
            let zExtent = d3.extent(zCol);
            let tExtent = d3.extent(tCol);
            let yScaleExtent = [1.2 * parseInt(minValue(xExtent[0], yExtent[0], zExtent[0])), 1.2 * parseInt(maxValue(xExtent[1], yExtent[1], zExtent[1]))];
            
            if(xExtent[0] < 2){
                yScaleExtent = [-0.99, 0.99]
            }
            
            // if(xExtent[0] < 2 && recordingName == "coffee-test-1"){
            //     yScaleExtent = [-0.8, 0.8]
            // }
        
            // if(xExtent[0] < 2 && recordingName == "coffee-test-2"){
            //     yScaleExtent = [-3.5, 0.99]
            // }
        
            const xScale = d3.scaleLinear()
                .domain(tExtent)
                .range([0, contentWidth]);
        
        
            const yScale = d3.scaleLinear()
                .domain(yScaleExtent) 
                .range([contentHeight, 0]);

            setScales({'x': xScale, 'y': yScale});
            
            
        }

    }, [data] )


    /*
    const mouseHoverRef = useRef(null);
    const mouseHoverLeftCircleRef = useRef(null);
    const mouseHoverCenterCircleRef = useRef(null);
    const mouseHoverRightCircleRef = useRef(null);
    const mouseHoverTextRef = useRef(null);
    const mouseHoverTextLine0Ref = useRef(null);
    const mouseHoverTextLine1Ref = useRef(null);
    const mouseHoverTextLine2Ref = useRef(null);
    const mouseHoverTextLine3Ref = useRef(null);
    const mouseHoverTextRectRef = useRef(null);
    */

   

    useEffect(() => {
        let xAxisElm = d3.select(xAxisRef.current);
        let yAxisElm = d3.select(yAxisRef.current);

        let xPathElm = d3.select(xPathRef.current);
        let yPathElm = d3.select(yPathRef.current);
        let zPathElm = d3.select(zPathRef.current);

        let svgElm = d3.select(svgRef.current);
        let taskPathElm = d3.select(taskPathRef.current);

        if(xAxisElm){
            console.log(scales['x'])
            // xAxisElm.call(d3.axisBottom(scales['x']));
        }

        // if(yAxisElm){
        //     yAxisElm.call(d3.axisLeft(scales['y']))
        // }

        for(let i = 0; i < data.length; i++){
            let d = data[i];
        }

        if(svgElm){

            // if(recordingName == "coffee-test-1"){
            //     for(let i = 0; i < taskStartTimestepsCoffeeTest1.length; i = i + 1){
            //         svgElm.append("line")
            //             .attr("x1", marginX + xScale(taskStartTimestepsCoffeeTest1[i])) 
            //             .attr("y1", marginY)
            //             .attr("x2", marginX + xScale(taskStartTimestepsCoffeeTest1[i]))  
            //             .attr("y2", marginY + contentHeight)
            //             .style("stroke-width", 2)
            //             .style("stroke", taskColor)
            //             .style("fill", "none")
            //             .style("stroke-dasharray", ("3, 3"));
            //     } 
            // } 

            // if(recordingName == "coffee-test-2"){
            //     for(let i = 0; i < taskStartTimestepsCoffeeTest2.length; i = i + 1){
            //         svgElm.append("line")
            //             .attr("x1", marginX + xScale(taskStartTimestepsCoffeeTest2[i])) 
            //             .attr("y1", marginY)
            //             .attr("x2", marginX + xScale(taskStartTimestepsCoffeeTest2[i]))  
            //             .attr("y2", marginY + contentHeight)
            //             .style("stroke-width", 2)
            //             .style("stroke", taskColor)
            //             .style("fill", "none")
            //             .style("stroke-dasharray", ("3, 3"));
            //     } 
            // } 

            //this needs to be on click play
            /*
            if(playing){
                svgElm.append("line")
                    .style("stroke-width", 2)
                    .style("stroke", "red")
                    .style("fill", "none")
                    .attr("x1", marginX)
                    .attr("y1", marginY)
                    .attr("x2", marginX)
                    .attr("y2", marginY + contentHeight)
                    .transition()
                    .duration(5000)
                    .attr("x1", contentWidth)
                    .attr("x2", contentWidth);
            }
            */
            
        }

        if(xPathElm){
            xPathElm.datum(data)
                .attr("fill", "none")
                .attr("stroke", xColor)
                .attr("stroke-width", 1.5)
                // @ts-ignore
                .attr("d", d3.line()
                    // @ts-ignore
                        .x(function(d) {  return scales['x'](d[3]) })
                    // @ts-ignore
                        .y(function(d) { return scales['y'](d[0]) })
                )
        }
        if(yPathElm){
            yPathElm.datum(data)
                .attr("fill", "none")
                .attr("stroke", yColor)
                .attr("stroke-width", 1.5)
                // @ts-ignore
                .attr("d", d3.line()
                    // @ts-ignore
                        .x(function(d) {  return scales['x'](d[3]) })
                    // @ts-ignore
                        .y(function(d) { return scales['y'](d[1]) })
                )
        }
        if(zPathElm){
            zPathElm.datum(data)
                .attr("fill", "none")
                .attr("stroke", zColor)
                .attr("stroke-width", 1.5)
                // @ts-ignore
                .attr("d", d3.line()
                    // @ts-ignore
                    .x(function(d, i) {  return scales['x'](d[3]) })
                    // @ts-ignore
                    .y(function(d) { return scales['y'](d[2]) })
                )
        }

    }, [scales])
    

    /*
    let inferX = (mouse) => {
        const [minX, maxX] = d3.extent(data, d=>d.frame);
        const [xCord,yCord] = d3.pointer(mouse);
        const ratio = xCord / contentWidth;
        const mouseX = minX + Math.round(ratio * (maxX - minX));
        let mouseFrameData = data.find(d => d.frame === mouseX);
        let mouseFrame = 0;
        if(mouseFrameData){
            mouseFrame = mouseFrameData.frame;
        }
        return mouseFrame;
    }
    */

    /*
    useEffect(() => {
        const contentElm = d3.select(contentRef.current);
        const mouseHoverElm = d3.select(mouseHoverRef.current);
        const mouseHoverLeftCircleElm = d3.select(mouseHoverLeftCircleRef.current);
        const mouseHoverCenterCircleElm = d3.select(mouseHoverCenterCircleRef.current);
        const mouseHoverRightCircleElm = d3.select(mouseHoverRightCircleRef.current);
        const mouseHoverTextElm = d3.select(mouseHoverTextRef.current);
        const mouseHoverTextLine0Elm = d3.select(mouseHoverTextLine0Ref.current)
        const mouseHoverTextLine1Elm = d3.select(mouseHoverTextLine1Ref.current)
        const mouseHoverTextLine2Elm = d3.select(mouseHoverTextLine2Ref.current)
        const mouseHoverTextLine3Elm = d3.select(mouseHoverTextLine3Ref.current);
        const mouseHoverTextRectElm = d3.select(mouseHoverTextRectRef.current);
        if(contentElm && mouseHoverElm && mouseHoverLeftCircleElm && mouseHoverCenterCircleElm &&
            mouseHoverRightCircleElm && mouseHoverTextElm &&
            mouseHoverTextLine0Elm && mouseHoverTextLine1Elm && mouseHoverTextLine2Elm &&
            mouseHoverTextLine3Elm && mouseHoverTextRectElm
        ) {
            contentElm.on("mouseover", function(mouse) {
                contentElm.style('display', 'block');
            })
            contentElm.on("mousemove", function (mouse){
                let mouseFrame = inferX(mouse);
                const leftValue = data.find(d => d.frame === mouseFrame)[0];
                const centerValue = data.find(d => d.frame === mouseFrame)[1];
                const rightValue = data.find(d => d.frame === mouseFrame)[2];
                mouseHoverElm.attr("transform", `translate(${xScale(mouseFrame)}, 0)`);
                mouseHoverLeftCircleElm.attr("cy", yScale(leftValue));
                mouseHoverCenterCircleElm.attr("cc", yScale(centerValue));
                mouseHoverRightCircleElm.attr("cy", yScale(rightValue));
                mouseHoverTextLine0Elm.text(`video: ${mouseFrame}%`);
                mouseHoverTextLine1Elm.text(`x axis: ${leftValue.toFixed(2)}`);
                mouseHoverTextLine2Elm.text(`y axis: ${rightValue.toFixed(2)}`)
                mouseHoverTextLine3Elm.text(`z axis: ${rightValue.toFixed(2)}`);
                mouseHoverTextElm
                    .attr('text-anchor', mouseFrame < (data.length) / 2 ? "start" : "end")
                    .attr("transform",  `translate(8, 30)`)
                mouseHoverTextRectElm.attr("transform", mouseFrame < (data).length / 2 ? `translate(3, 22)`: `translate(-80, 22)`);
                ;
            })
        }
    })
    */

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
                    transform={`translate(${30}, ${10})`}
                    ref={contentRef}
                >
                    <g
                        ref={xAxisRef}
                        transform={`translate(0,${160})`}
                    >
                    </g>

                    <g
                        ref={yAxisRef}
                    ></g>

                    <path
                        ref={xPathRef}
                    >
                    </path>

                    <path
                        ref={yPathRef}
                    >

                    </path>

                    <path
                        ref={zPathRef}
                    >

                    </path>

                    <g
                        transform={"translate(190, 0)"}
                    >
                        <g transform={"translate(0, 0)"}>
                            <circle
                                fill={xColor}
                                r={5}
                                cx={0}
                                cy={2.5}
                            ></circle>
                            <text
                                x={12}
                                y={6}
                                fontSize={12}
                            >
                                X
                            </text>
                        </g>
                        <g transform={"translate(30, 0)"}>
                            <circle
                                fill={yColor}
                                r={5}
                                cx={0}
                                cy={2.5}
                            ></circle>
                            <text
                                x={12}
                                y={6}
                                fontSize={12}
                            >
                                Y
                            </text>
                        </g>
                        <g transform={"translate(60, 0)"}>
                            <circle
                                fill={zColor}
                                r={5}
                                cx={0}
                                cy={2.5}
                            ></circle>
                            <text
                                x={12}
                                y={6}
                                fontSize={12}
                            >
                                Z
                            </text>
                        </g>
                    </g>

                </g>
            </svg>
        </div>
    )

}

export default IMUActivityBarChart;