export class GazePointCloud {

    // highlighted gaze
    public currentHighlightedGazePoint!: THREE.Points;
    public currentHighlightedGazeDirection!: THREE.Line;

    constructor( public points: number[][], public normals: number[][], public timestamps: number[] ){}

    // returns positions and normals
    public get_buffer_positions( start: number = -1, end: number = -1 ): [number[], number[]]{

        let positions: number[][] = this.points;
        let normals: number[][] = this.normals;
        if(start !== -1 && end !== -1){
            positions = positions.slice( start, end );
            normals = normals.slice( start, end );
        }

        // const positions: number[] = this.points.flat();
        // const normals: number[] = this.normals.flat();

        return [positions.flat(), normals.flat()];
    }

    // return all timestamps in the gaze point cloud
    public get_all_timestamps(): number[] {
        return this.timestamps;
    }

}