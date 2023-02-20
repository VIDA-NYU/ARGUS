// third-party
// import * as d3 from 'd3';
// import { VoxelCube } from '../../../types/DataTypes';
// import { VoxelCube  } from '../../../types/types';
import { VoxelCell } from './VoxelCell';

export class WorldPointCloud{

    // world extents
    public xExtent: number[] = [];
    public yExtent: number[] = [];
    public zExtent: number[] = [];

    // voxel grid
    public voxelGrid: VoxelCell[][][] = [];
    private voxelResolution: number = 1.0;

    // highlighted scene objects
    public gazeDirectionHighlightedCubesGroup!: THREE.Group;
    public gazeOriginHighlightedCubesGroup!: THREE.Group;
    public gazeDirectionHighlightedPointsGroup!: THREE.Points;

    constructor( public points: number[][], public colors: number[][] ){

        // calculating world extents
        this.calculate_world_extents( this.points );

        // building voxel grid
        this.build_voxel_grid( this.voxelResolution );

    }

    // // calculate the cubes that
    // public get_corresponding_voxel_cubes( points: number[][] ): VoxelCube[] {

    //     const cubes: {[center: string]: VoxelCube} = {};
    //     points.forEach( (point: number[]) => {

    //         // calculating indices
    //         const xIndex: number = Math.floor( (point[0] - this.xExtent[0])/this.voxelResolution );
    //         const yIndex: number = Math.floor( (point[1] - this.yExtent[0])/this.voxelResolution );
    //         const zIndex: number = Math.floor( (point[2] - this.zExtent[0])/this.voxelResolution );

    //         // getting corresponding cube
    //         const cellCube: VoxelCube = this.voxelGrid[xIndex][yIndex][zIndex].get_voxel_cube();

    //         // indexing cube
    //         const index: string = `${cellCube.center.join('-')}`;
    //         cubes[index] = cellCube;
            

    //     });

    //     return Object.values(cubes);

    // }

    // // calculate the cubes that
    // public get_corresponding_voxel_points( points: number[][] ): [number[], number[]] {

    //     let bufferPositions: number[] = [];
    //     let bufferColors: number[] = [];
    //     points.forEach( (point: number[]) => {

    //         // calculating indices
    //         const xIndex: number = Math.floor( (point[0] - this.xExtent[0])/this.voxelResolution );
    //         const yIndex: number = Math.floor( (point[1] - this.yExtent[0])/this.voxelResolution );
    //         const zIndex: number = Math.floor( (point[2] - this.zExtent[0])/this.voxelResolution );

    //         // getting corresponding cube
    //         const voxelCell: VoxelCell = this.voxelGrid[xIndex][yIndex][zIndex];

    //         // getting buffer points
    //         const [positions, colors]: [number[], number[]] = voxelCell.get_buffer_positions();

    //         // concating
    //         bufferPositions = bufferPositions.concat(positions);
    //         bufferColors = bufferColors.concat(colors);
            
            
    //     });

    //     return [bufferPositions, bufferColors];

    // }

    // public get_voxel_cubes(): VoxelCube[] {

    //     const cubes: VoxelCube[] = [];
    //     for( let i = 0; i < this.voxelGrid.length; i++ ){
    //         for( let j = 0; j < this.voxelGrid[i].length; j++ ){
    //             for( let k = 0; k < this.voxelGrid[i][j].length; k++ ){
    //                 // if( this.voxelGrid[i][j][k].points.length > 0 ){
    //                     const cellCube: VoxelCube = this.voxelGrid[i][j][k].get_voxel_cube();
    //                     cubes.push(cellCube);
    //                 // }
    //             }
    //         }
    //     }

    //     return cubes;
    // }

    // public get_buffer_positions(): [number[], number[]] {

    //     let bufferPositions: number[] = [];
    //     let bufferColors: number[] = [];
    //     for(let i = 0; i < this.voxelGrid.length; i++){
    //         for(let j = 0; j < this.voxelGrid[i].length; j++){
    //             for(let k = 0; k < this.voxelGrid[i][j].length; k++){
    //                 const [voxelPoints, voxelColors]: [number[], number[]] = this.voxelGrid[i][j][k].get_buffer_positions( 2000 );
    //                 bufferPositions = bufferPositions.concat(voxelPoints); 
    //                 bufferColors = bufferColors.concat(voxelColors);
    //             }
    //         }
    //     }

    //     return [bufferPositions, bufferColors];

    // }

    private build_voxel_grid( cellSize: number = 0.1 ): void {

        // calculating number of cells
        if( this.xExtent.length == 0 || this.yExtent.length == 0 || this.zExtent.length == 0 ) throw new Error('Extents not initalized');

        // initializing voxel grid
        const xGridSize: number = Math.ceil((this.xExtent[1] - this.xExtent[0])/cellSize);
        const yGridSize: number = Math.ceil((this.yExtent[1] - this.yExtent[0])/cellSize);
        const zGridSize: number = Math.ceil((this.zExtent[1] - this.zExtent[0])/cellSize);

        for( let i = 0; i < xGridSize; i++){
            this.voxelGrid[i] = [];
            for( let j = 0; j < yGridSize; j++){
                this.voxelGrid[i][j] = [];
                for(let k = 0; k < zGridSize; k++){
                    this.voxelGrid[i][j][k] = new VoxelCell( 
                        [this.xExtent[0] + (i*cellSize), this.xExtent[0] + ((i+1)*cellSize) ], 
                        [this.yExtent[0] + (j*cellSize), this.yExtent[0] + ((j+1)*cellSize) ], 
                        [this.zExtent[0] + (k*cellSize), this.zExtent[0] + ((k+1)*cellSize) ]);
                }
            }
        }

        // populating grid
        this.points.forEach( (point: number[], index: number) => {

            // calculating indices
            const xIndex: number = Math.floor( (point[0] - this.xExtent[0])/cellSize );
            const yIndex: number = Math.floor( (point[1] - this.yExtent[0])/cellSize );
            const zIndex: number = Math.floor( (point[2] - this.zExtent[0])/cellSize );
            
            // adding point to voxel grid
            this.voxelGrid[xIndex][yIndex][zIndex].points.push(point);
            
            // adding colors
            this.voxelGrid[xIndex][yIndex][zIndex].colors.push(this.colors[index]);


        });         
    } 

    private calculate_world_extents( points: number[][] ): void {

        // console.log('D3 Extent...');
        // console.log('x: ', d3.extent(points, point => point[0] ));
        // console.log('y: ', d3.extent(points, point => point[1] ));
        // console.log('z: ', d3.extent(points, point => point[2] ));

        const xExtent: number[] = [Infinity, -Infinity];
        const yExtent: number[] = [Infinity, -Infinity];
        const zExtent: number[] = [Infinity, -Infinity];

        this.points.forEach( (point: number[] ) => {

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