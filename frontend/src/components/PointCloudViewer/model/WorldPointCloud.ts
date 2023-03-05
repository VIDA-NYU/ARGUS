// third-party
// import * as d3 from 'd3';

export class WorldPointCloud{

    // world extents
    public xExtent: number[] = [];
    public yExtent: number[] = [];
    public zExtent: number[] = [];

    constructor( public worldCoords: number[][], public worldColors: number[][] ){

        // calculating world extents
        this.calculate_world_extents( worldCoords );

    }

    public get_buffer_positions(): [number[], number[]] {

        return [this.worldCoords.flat(), this.worldColors.flat()];

    }

    private calculate_world_extents( points: number[][] ): void {

        const xExtent: number[] = [Infinity, -Infinity];
        const yExtent: number[] = [Infinity, -Infinity];
        const zExtent: number[] = [Infinity, -Infinity];

        points.forEach( (point: number[] ) => {

            xExtent[0] = Math.min(point[0], xExtent[0]);
            xExtent[1] = Math.max(point[0], xExtent[1]);

            yExtent[0] = Math.min(point[1], yExtent[0]);
            yExtent[1] = Math.max(point[1], yExtent[1]);

            zExtent[0] = Math.min(point[2], zExtent[0]);
            zExtent[1] = Math.max(point[2], zExtent[1]);

        });

        this.xExtent = xExtent;
        this.yExtent = yExtent;
        this.zExtent = zExtent;
    }

}