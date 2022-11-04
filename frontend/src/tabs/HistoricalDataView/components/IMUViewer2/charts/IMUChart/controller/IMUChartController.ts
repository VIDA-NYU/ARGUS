import * as d3 from 'd3';

export class IMUChartController {

    public margins: { top: number, bottom: number, left: number, right: number } = { top: 30, bottom: 30, left: 30, right: 30 }

    // chart svg
    public chartSVG!: any;

    // line generator
    public lineGenerator!: any;

    // chart dimensions
    public width!: number;
    public height!: number;

    public initialize_chart( container: HTMLElement ): void {

        // creating svg
        this.create_svg( container );

    }

    public create_svg( container: HTMLElement ): void {
        
        const containerWidth: number = container.clientWidth;
        const containerHeight: number = container.clientHeight;

        // saving dimensions
        this.width = containerWidth;
        this.height = containerHeight;

        // creating and saving svg
        this.chartSVG = d3.select(container)
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight);

    }

    public render_line( lineData: number[] ): void {

        // calculating scales
        const xScale = d3.scaleLinear()
                .domain([0, lineData.length])
                .range([0, this.width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(lineData))
            .range([0, this.height]);

        this.chartSVG.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x( (d: any, i: number) => xScale(i) )
                .y( (d: any, i: number) => yScale(d) )
        )

    }


}