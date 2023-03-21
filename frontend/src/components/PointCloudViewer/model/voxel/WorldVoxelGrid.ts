
// model
import { VoxelCell } from "./VoxelCell";

export class WorldVoxelGrid {

    private cellSize: number = 0.025;

    constructor( public xExtent: number[], public yExtent: number[], public zExtent: number[] ){} 

    // Voxel Map: maps a 'i-j-k' to a voxelCell;
    public voxelMap: { [voxelIndex: string]: VoxelCell } = {};

    public update_voxel_grid( pointCloudName: string, points: number[][] ): void {

        // calculating number of cells
        if( this.xExtent.length == 0 || this.yExtent.length == 0 || this.zExtent.length == 0 ) throw new Error('Extents not initalized');

        // Initializing grid
        points.forEach( (point: number[], index: number) => {

            // calculating indices
            const xIndex: number = Math.floor( (point[0] - this.xExtent[0])/this.cellSize );
            const yIndex: number = Math.floor( (point[1] - this.yExtent[0])/this.cellSize );
            const zIndex: number = Math.floor( (point[2] - this.zExtent[0])/this.cellSize );
            
            const voxelIndex: string = `${xIndex}-${yIndex}-${zIndex}`;

            if( !(voxelIndex in this.voxelMap) ){
                this.voxelMap[voxelIndex] = new VoxelCell(
                                    [this.xExtent[0] + (xIndex*this.cellSize), this.xExtent[0] + ((xIndex+1)*this.cellSize) ], 
                                    [this.yExtent[0] + (yIndex*this.cellSize), this.yExtent[0] + ((yIndex+1)*this.cellSize) ], 
                                    [this.zExtent[0] + (zIndex*this.cellSize), this.zExtent[0] + ((zIndex+1)*this.cellSize) ])
            }

            // indexing point
            this.voxelMap[voxelIndex].index_new_point( pointCloudName, index);

        });     
        
    }

    public get_point_cloud_voxel_cells( pointCloudName: string ): VoxelCell[] {

        const voxelCells: VoxelCell[] = [];
        Object.values(this.voxelMap).forEach( (voxelCell: VoxelCell) => {

            if( voxelCell.is_point_cloud_indexed(pointCloudName) ){
                voxelCells.push( voxelCell );
            }

        });      

        return voxelCells;
    }
    
}