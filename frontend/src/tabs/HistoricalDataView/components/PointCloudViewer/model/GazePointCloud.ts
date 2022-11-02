export class GazePointCloud {

    constructor( public points: number[][], public normals: number[][] ){}

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

}