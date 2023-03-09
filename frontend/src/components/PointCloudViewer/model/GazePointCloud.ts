export class GazePointCloud {
    
    // projection of the gaze point into world point cloud
    public gazeWorldProjection!: number[][];

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

    public set_gaze_world_projection( gazeProjection: number[][] ): void{
        this.gazeWorldProjection = gazeProjection;
    }

}