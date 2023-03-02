import * as d3 from 'd3';

export class Tooltip{

    public container!: d3.Selection<any,any,any,any>;

    constructor( tooltipContainer: HTMLElement ){

        this.container = d3.select(tooltipContainer);

    }


    public position_tooltip( top: number, left: number ): void {

        this.container
            .style('top', `${top}px` )
            .style('left', `${left}px` );

    }



}