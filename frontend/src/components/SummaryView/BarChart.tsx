// BarChart.js
import * as d3 from 'd3';
import { axisBottom, brushSelection, brushX, scaleLinear, select } from 'd3';
import React, { useRef, useEffect, useCallback } from 'react';
import { UserDataNode } from 'three/examples/jsm/nodes/Nodes';

interface Datatype{
    label:string,
    value:number,
    index: number
}

function BarChart({ width, height, datas, title}) {
    const xAxisRef = useRef(null);
    const barchartRef = useRef(null);
    const yAxisRef = useRef(null);
    const titleRef = useRef(null);
    const brushRef= useRef(null);
    let data: Datatype[]  = datas.map((d,i) => {
            var a = {"label":i, "value": d, "index": i};
            return a;
        }
    );
    var margin = ({top: 3, right: 0, bottom: 30, left: 20});
    
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "0px solid white")
    }, []);

    useEffect(() => {
        draw();
        // runBrushes().catch(console.error);
    }, [data]);


    const draw = () => {
        var yMax = d3.max(data, d => d.value)
        var xDomain = data.map(d => d.label);
        var xScale = d3.scaleBand()
            .domain( xDomain )
            .range([ margin.left, width - margin.right - margin.left ])
            .padding(0.2);
        var yScale = d3.scaleLinear()
            .domain([ 0, yMax ])
            .range([ height - margin.bottom, margin.top ])

        var xAxis = d3.axisBottom(xScale)
            .tickFormat((d, i) => {
                return i % 2 ? i.toString() : ""; })
            .ticks(5).tickSizeOuter(0);
        var yAxis = d3.axisLeft(yScale)
                        .tickFormat((d, i) => {
                            return i % 2 ? i.toString() : ""; })
            .tickSizeOuter(0);

        const svg = d3.select(ref.current);
        const gBar = d3.select(barchartRef.current)
            // .attr('transform', `translate(${ margin.left },${ 0})`)
            .attr("width", width-margin.left-margin.right)
            .attr("height", height-margin.top-margin.bottom)

        let xAxisElm = d3.select(xAxisRef.current);
        let yAxisElm = d3.select(yAxisRef.current);
        let titleRefElm = d3.select(titleRef.current);
        var selection = gBar.selectAll("rect").data(data);
        // selection
        //     .transition().duration(300)
        //         .attr("height", (d) => yScale(d))
        //         .attr("y", (d) => height - yScale(d))
        //         // .attr("x", (d) => width - xScale(d))

        // if(xAxisElm){
        //     xAxisElm.call(d3.axisBottom(xScale));
        // }
        selection
            .enter()
            .append("rect")
            .attr('x', d => xScale(d.label))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => yScale(0) - yScale(d.value))
            .style('fill', 'grey')
        
        xAxisElm
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${ height - margin.bottom })`)
            .call( xAxis )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("font-size","8px")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        yAxisElm
            .attr('class', 'y-axis')
            .attr('transform', `translate(${ margin.left },0)`)
            .call( yAxis )

        titleRefElm
            .append("text")
            .attr("font-size","13px")
            .attr("text-anchor", "end")
            .attr("x", width/2 + margin.left + 10)
            .attr("y", height-3) ///2 - 30  )
            .text(title);
        // selection
        //     .exit()
        //     .transition().duration(300)
        //         .attr("y", (d) => height)
        //         .attr("height", 0)
        //     .remove()
    
    }

    // const x = scaleLinear().domain(data.map(d => d.index)).range([ margin.left, width - margin.right - margin.left ]);
    // const runBrushes = useCallback(async () => {
    //     const brush = brushX()
    //         .extent([
    //             [10, 10],
    //             [20, 50],
    //         ])
    //         .on('start brush end', function () {
    //             const nodeSelection = brushSelection(
    //                 select(brushRef.current).node(),
    //             );
    //             const index = nodeSelection.map(data.values)//(x.invert);
    //             // setPos(index);
    //         });
    
    //     select(brushRef.current).call(brush).call(brush.move, [0, 100].map(x));
    // }, [data, data]); //[pos, x]);

    return (
        <div className="chart">
            <svg ref={ref}>
                <g ref={barchartRef} />
                <g ref={xAxisRef} />
                <g ref={yAxisRef} />
                <g ref={titleRef} />
                <g ref={brushRef} />
            </svg>
        </div>
        
    )

}

export default BarChart;