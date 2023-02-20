// import { VoxelCube } from "../../../types/DataTypes";
// import { VoxelCube  } from "../../../types/types";


export class VoxelCell {

    public points: number[][] = [];
    public colors: number[][] = [];

    constructor( public xExtent: number[], public yExtent: number[], public zExtent: number[] ){}

    // // returns a cube corresponding to the voxel
    // public get_voxel_cube(): VoxelCube {

    //     const width:    number = Math.abs(this.xExtent[1] - this.xExtent[0]);
    //     const height:   number = Math.abs(this.yExtent[1] - this.yExtent[0]);
    //     const depth:    number = Math.abs(this.zExtent[1] - this.zExtent[0]);
    //     const center:   number[] = [
    //         (this.xExtent[1] + this.xExtent[0])/2,
    //         (this.yExtent[1] + this.yExtent[0])/2,
    //         (this.zExtent[1] + this.zExtent[0])/2,
    //     ];

    //     const cube: VoxelCube = { width, height, depth, center }
    //     return cube;

    // }

    // public get_buffer_positions( sampleSize: number = -1 ): [number[], number[]] {

        
    //     if(sampleSize === -1){
    //         return [ this.points.flat(), this.colors.flat() ];
    //     }

    //     if(sampleSize > this.points.length){
    //         return [this.points.flat(), this.colors.flat()];
    //     } 
        
    //     const bufferPositions: number[] = [];
    //     const bufferColors: number[] = [];
    //     for(let i = 0; i < sampleSize; i++ ){

    //         const randomIndex: number = Math.floor(Math.random() * this.points.length);

    //         // adding x, y, z
    //         bufferPositions.push( this.points[randomIndex][0], this.points[randomIndex][1], this.points[randomIndex][2] );
    //         bufferColors.push( this.colors[randomIndex][0], this.colors[randomIndex][1], this.colors[randomIndex][2] );

    //     }

    //     return [bufferPositions, bufferColors];

    // }

}