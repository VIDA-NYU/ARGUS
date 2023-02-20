import * as d3 from 'd3';
import { TimestampManager } from '../../../../PointCloudViewerBAK/controller/TimestampManager';

export class IMUChartController {

    public margins: { top: number, bottom: number, left: number, right: number } = { top: 60, bottom: 40, left: 60, right: 10 }

    // chart svg
    public chartSVG!: any;
    public chartGroup!: any;

    // line generator
    public lineGenerator!: any;

    // chart dimensions
    public width!: number;
    public height!: number;

    // axes
    public xAxisGroup!: any;
    public yAxisGroup!: any;
    public movingAxisGroup!: any;

    // temp
    public timestamp: number = 0;
    public timestampManager!: TimestampManager;

    // scales
    public xScale!: any;
    public yScale!: any;

    // labels
    public labelsGroup!: any;
    public xAxisLabelGroup!: any;
    public yAxisLabelGroup!: any;


    public initialize_chart( container: HTMLElement ): void {

        // creating svg
        this.create_svg( container );

        // creating group
        // this.create_group();

    }

    public initialize_timestamp_manager( timestamps: number[] ): void {

        this.timestampManager.generate_gaze_timestamp_index( timestamps );

    }

    public move_time_axis( initialTimestamp: number, currentTimestamp: number ): void {
        const closestTimestamp: number = this.timestampManager.get_imu_timestamp_index( initialTimestamp, currentTimestamp );

        this.movingAxisGroup
            .attr("transform", `translate(${this.margins.left + this.xScale(closestTimestamp)},${this.margins.top})`)

    }

    public create_svg( container: HTMLElement ): void {
        
        const containerWidth: number = container.clientWidth;
        const containerHeight: number = container.clientHeight;

        // saving dimensions
        this.width = containerWidth;
        this.height = containerHeight;

        // creating and saving svg
        const chartSVG = d3.select(container)
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight);

        // this.chartGroup = this.chartSVG.append('g');
        const chartGroup = chartSVG
                .append("g")
                .attr("transform", `translate(${this.margins.left},${this.margins.top})`);

        this.chartSVG = chartSVG;
        this.chartGroup = chartGroup;

    }

    public create_group(): void {
        this.chartGroup = this.chartSVG.append('g').attr("transform", `translate(${this.margins.left},${this.margins.top})`)
    }

    public clear_chart(): void {

        this.chartSVG.selectAll('.axis-group').remove();
        this.chartSVG.selectAll('.imu-line').remove();
        this.chartSVG.selectAll('.label-group').remove();
    }

    public add_line_labels(): void {

        // colors
        const colors: string[] = ['steelblue', 'orange', 'green'];
        const axes: string[] = ['x', 'y', 'z'];

        this.labelsGroup = this.chartSVG.append('g').attr('class', 'label-group').attr("transform", `translate(${ this.margins.left + this.margins.right},${this.margins.top - 30})`);
        
        for(let i = 0; i < 3; i++){

            this.labelsGroup
                .append('circle')
                .attr('cx', 80 * i)
                .attr('cy', 10)
                .attr('r', 10)
                .attr('fill', colors[i]);

            this.labelsGroup
                .append('text')
                .attr('x', (80 * i) + 15)
                .attr('y', 10)
                .attr('alignment-baseline', 'central')
                .text(axes[i])
        }
        
        

    }

    public add_axes_labels(): void {

        this.xAxisLabelGroup = this.chartSVG.append('g')
            .attr('class', 'axis-group')
            .attr("transform", `translate(${this.width - this.margins.right},${this.height - this.margins.bottom + 10})`)
            .append('text')
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'end')
            .text('Time');

        this.yAxisLabelGroup = this.chartSVG.append('g')
            .attr('class', 'axis-group')
            .attr("transform", `translate(${10},${this.margins.top + 10}) rotate(270)`)
            .append('text')
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'end')
            .text('Magnitude');

    }

    public create_axes( xScale: any, yScale: any, firstEntry: any ): void {

        this.yAxisGroup = this.chartSVG.append('g').attr('class', 'axis-group').attr("transform", `translate(${this.margins.left},${this.margins.top})`)
        this.xAxisGroup = this.chartSVG.append('g').attr('class', 'axis-group').attr("transform", `translate(${this.margins.left},${this.height - this.margins.bottom})`)
        this.movingAxisGroup = this.chartSVG.append('g').attr('class', 'axis-group').attr("transform", `translate(${this.margins.left},${this.margins.top})`);

        // @ts-ignore
        this.xAxisGroup.call(d3.axisBottom(xScale).tickFormat( (d: any) => { return (((d - firstEntry)/1000)/60).toFixed(2) }));
        this.yAxisGroup.call(d3.axisLeft(yScale));
        this.movingAxisGroup.call(d3.axisLeft(yScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(0).ticks(0));

        // formating text
        this.xAxisGroup.selectAll('text')


        this.movingAxisGroup.selectAll(".domain").attr("stroke-dasharray", "2,2");


    }

    public render_line( lineData: number[][], timestamps: number[], firstEntry: number ): void {

        // adding labels
        this.add_line_labels();
        this.add_axes_labels();

        // initializing timestamp manager
        this.timestampManager = new TimestampManager();
        this.timestampManager.generate_gaze_timestamp_index( timestamps );

        // calculating scales
        const xScale = d3.scaleLinear()
                .domain(d3.extent(timestamps) /*[0, lineData.length]*/ )
                .range([0, this.width - this.margins.left - this.margins.right]);

        const yMax = d3.max( lineData, element => d3.max(element) );
        const yMin = d3.min( lineData, element => d3.min(element) );

        const yScale = d3.scaleLinear()
            .domain([yMax, yMin])
            .range([0, this.height - this.margins.top - this.margins.bottom]);


        // saving scales
        this.xScale = xScale;
        this.yScale = yScale;


        // creating axes
        this.create_axes( xScale, yScale, firstEntry );

        // rendering lines
        this.chartGroup.append("path")
            .datum(lineData)
            .attr('class', 'imu-line')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x( (d: any, i: number) => xScale(timestamps[i]) )
                .y( (d: any, i: number) => yScale(d[0]) ))

        this.chartGroup.append("path")
            .datum(lineData)
            .attr('class', 'imu-line')
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x( (d: any, i: number) => xScale(timestamps[i]) )
                .y( (d: any, i: number) => yScale(d[1]) ))

        this.chartGroup.append("path")
            .datum(lineData)
            .attr('class', 'imu-line')
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x( (d: any, i: number) => xScale(timestamps[i]) )
                .y( (d: any, i: number) => yScale(d[2]) ))

    }


}