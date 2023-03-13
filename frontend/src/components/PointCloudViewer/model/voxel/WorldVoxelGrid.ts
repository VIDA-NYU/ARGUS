import { VoxelCube } from "../../types/types";
import { VoxelCell } from "./VoxelCell";

export class WorldVoxelGrid {

    private cellSize: number = 0.05;

    constructor( public xExtent, public yExtent, public zExtent ){}

    // voxel grid
    public voxelGrid: VoxelCell[][][] = [];

    public build_voxel_grid( coords: number[][], colors: number[][] ): void {

        // calculating number of cells
        if( this.xExtent.length == 0 || this.yExtent.length == 0 || this.zExtent.length == 0 ) throw new Error('Extents not initalized');

        // initializing voxel grid
        const xGridSize: number = Math.ceil((this.xExtent[1] - this.xExtent[0])/this.cellSize);
        const yGridSize: number = Math.ceil((this.yExtent[1] - this.yExtent[0])/this.cellSize);
        const zGridSize: number = Math.ceil((this.zExtent[1] - this.zExtent[0])/this.cellSize);

        for( let i = 0; i < xGridSize; i++){
            this.voxelGrid[i] = [];
            for( let j = 0; j < yGridSize; j++){
                this.voxelGrid[i][j] = [];
                for(let k = 0; k < zGridSize; k++){
                    this.voxelGrid[i][j][k] = new VoxelCell( 
                        [this.xExtent[0] + (i*this.cellSize), this.xExtent[0] + ((i+1)*this.cellSize) ], 
                        [this.yExtent[0] + (j*this.cellSize), this.yExtent[0] + ((j+1)*this.cellSize) ], 
                        [this.zExtent[0] + (k*this.cellSize), this.zExtent[0] + ((k+1)*this.cellSize) ]);
                }
            }
        }

        // populating grid
        coords.forEach( (point: number[], index: number) => {

            // calculating indices
            const xIndex: number = Math.floor( (point[0] - this.xExtent[0])/this.cellSize );
            const yIndex: number = Math.floor( (point[1] - this.yExtent[0])/this.cellSize );
            const zIndex: number = Math.floor( (point[2] - this.zExtent[0])/this.cellSize );
            
            // adding point to voxel grid
            this.voxelGrid[xIndex][yIndex][zIndex].points.push(point);
            
            // adding colors
            this.voxelGrid[xIndex][yIndex][zIndex].colors.push(colors[index]);

        });         
    } 

    public get_cell_size(): number{
        return this.cellSize;
    }

    public get_voxel_cubes( streamCounter: string ): [VoxelCube[], number[]] {

        const cubes: VoxelCube[] = [];
        const counters: number[] = [];

        for( let i = 0; i < this.voxelGrid.length; i++ ){
            for( let j = 0; j < this.voxelGrid[i].length; j++ ){
                for( let k = 0; k < this.voxelGrid[i][j].length; k++ ){

                    if( streamCounter in this.voxelGrid[i][j][k].counters ){
                        const cellCube: VoxelCube = this.voxelGrid[i][j][k].get_voxel_cube();
                        cubes.push(cellCube);
                        counters.push(this.voxelGrid[i][j][k].counters[streamCounter])
                    }

                    // if( this.voxelGrid[i][j][k].points.length > 0 ){
                    //     const cellCube: VoxelCube = this.voxelGrid[i][j][k].get_voxel_cube();
                    //     cubes.push(cellCube);
                    // }
                }
            }
        }

        return [cubes, counters];
    }
}