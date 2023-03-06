export class GazePointCloud {

    // highlighted gaze
    public currentHighlightedGazePoint!: THREE.Points;
    public currentHighlightedGazeDirection!: THREE.Line;

    constructor( public points: number[][], public normals: number[][], public timestamps: number[] ){}

    // returns positions and normals
    public get_buffer_positions( start: number = -1, end: number = -1 ): [number[], number[][], number[]]{

        let positions: number[][] = this.points;
        let normals: number[][] = this.normals;
        let timestamps: number[] = this.timestamps;

        if(start !== -1 && end !== -1){
            positions = positions.slice( 0, positions.length );
            normals = normals.slice( 0, positions.length );
            timestamps = timestamps.slice( 0, positions.length );
        }

        return [positions.flat(), normals, timestamps ];
    }

    // return all timestamps in the gaze point cloud
    // public get_all_timestamps(): number[] {
    //     return this.timestamps;
    // }

}