import {useEffect, useRef} from "react";
import * as d3 from "d3";

const SvgWidth = 300;
const SvgHeight = 200;
/*
interface IMUActivityLineChartProps {
    data: Array<FrameMovement>
}
*/

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
const timestampLineColor = "red"

/*
function computePercentage(d, index, data){
    return Math.round(100 * d.frame/data.length)
}
*/

function IMUActivityLineChart({data, measure, units}: any){
    console.log("entered activity line chart")
    console.log(data)

    const svgRef = useRef(null);
    const contentRef = useRef(null);

    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);
    const xPathRef = useRef(null);
    const yPathRef = useRef(null);
    const zPathRef = useRef(null);
    const timestampPathRef = useRef(null);

    let marginX = 30;
    let marginY = 20;
    let contentHeight = 150;
    let contentWidth = 270;
    
    var xCol = data.map((obj, index) => (obj.imu_values[0]));
    var yCol = data.map((obj, index) => (obj.imu_values[1]));
    var zCol = data.map((obj, index) => (obj.imu_values[2]));
    var tCol = data.map((obj, index) => (obj.sec_from_start));

    
    let xExtent = [parseFloat(d3.min(xCol)), parseFloat(d3.max(xCol))];
    let yExtent = [parseFloat(d3.min(yCol)), parseFloat(d3.max(yCol))];
    let zExtent = [parseFloat(d3.min(zCol)), parseFloat(d3.max(zCol))];
    let tExtent = [parseFloat(d3.min(tCol)), parseFloat(d3.max(tCol))];
    let yScaleExtent = [1.2 * parseInt(minValue(xExtent[0], yExtent[0], zExtent[0])), 1.2 * parseInt(maxValue(xExtent[1], yExtent[1], zExtent[1]))];
    
    if(parseFloat(d3.min(xCol)) < 2){
        yScaleExtent = [-0.99, 0.99]
    }

    const xScale = d3.scaleLinear()
        .domain(tExtent)
        .range([0, contentWidth]);


    const yScale = d3.scaleLinear()
        .domain(yScaleExtent) 
        .range([contentHeight, 0]);

    useEffect(() => {
        let xAxisElm = d3.select(xAxisRef.current);
        let yAxisElm = d3.select(yAxisRef.current);

        let xPathElm = d3.select(xPathRef.current);
        let yPathElm = d3.select(yPathRef.current);
        let zPathElm = d3.select(zPathRef.current);
        let timestampPathElm = d3.select(timestampPathRef.current);
        console.log("Entered activity line chart use effect")
        console.log(xPathElm)
        console.log(yPathElm)
        console.log(zPathElm)

        let svgElm = d3.select(svgRef.current);

        if(xAxisElm){
            xAxisElm.call(d3.axisBottom(xScale));
        }

        if(yAxisElm){
            yAxisElm.call(d3.axisLeft(yScale))
        }

        for(let i = 0; i < data.length; i++){
            let d = data[i];
        }

        if(xPathElm){
            xPathElm.datum(data)
                .attr("fill", "none")
                .attr("stroke", xColor)
                .attr("stroke-width", 1.5)
                // @ts-ignore
                .attr("d", d3.line()
                    // @ts-ignore
                        .x(function(d) {  return xScale(d.sec_from_start)})
                    // @ts-ignore
                        .y(function(d) { return yScale(d.imu_values[0]) })
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
                        .x(function(d) {  return xScale(d.sec_from_start) })
                    // @ts-ignore
                        .y(function(d) { return yScale(d.imu_values[1]) })
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
                    .x(function(d, i) {  return xScale(d.sec_from_start) })
                    // @ts-ignore
                    .y(function(d) { return yScale(d.imu_values[2]) })
                )
        }

        if(timestampPathElm){
            timestampPathElm.datum(data)
                .attr("fill", "none")
                .attr("stroke", timestampLineColor)
                .attr("stroke-width", 1.5)
                .attr("x1", function(d, i) {  return xScale(d.sec_from_start) }) 
                .attr("y1", 0)
                .attr("x2", function(d, i) {  return xScale(d.sec_from_start) })  
                .attr("y2", SvgHeight)
        }

    }, [xScale, yScale])


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
                        ref={xAxisRef}
                        transform={`translate(0,${contentHeight})`}
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

                    <path
                        ref={timestampPathRef}
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
                    <g
                        transform={"translate(-5, -10)"}
                    >
                        <text
                                x={12}
                                y={6}
                                fontSize={12}
                            >
                                {measure}
                        </text>
                    </g>
                    <g
                        transform={`translate(-40, -10)`}
                    >
                        <text
                                x={12}
                                y={6}
                                fontSize={8}
                            >
                                {units}
                        </text>
                    </g>
                    <g
                        transform={`translate(${SvgWidth - (marginX + 40)}, ${SvgHeight - 30})`}
                    >
                        <text
                                x={12}
                                y={6}
                                fontSize={8}
                            >
                                Time (s)
                        </text>
                    </g>
                </g>
            </svg>
        </div>
    )

}

export default IMUActivityLineChart;
