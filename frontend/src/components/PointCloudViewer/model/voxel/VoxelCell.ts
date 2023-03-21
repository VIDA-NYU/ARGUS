import { VoxelCube  } from '../../types/types';

export class VoxelCell {

    // Holds all the points within the Voxel
    private pointCloudIndices: { [pointCloudName: string]: Set<number> } = {};

    constructor( public xExtent: number[], public yExtent: number[], public zExtent: number[] ){}

    // returns a cube corresponding to the voxel
    public get_voxel_cube(): VoxelCube {

        const width:    number = Math.abs(this.xExtent[1] - this.xExtent[0]);
        const height:   number = Math.abs(this.yExtent[1] - this.yExtent[0]);
        const depth:    number = Math.abs(this.zExtent[1] - this.zExtent[0]);
        const center:   number[] = [
            (this.xExtent[1] + this.xExtent[0])/2,
            (this.yExtent[1] + this.yExtent[0])/2,
            (this.zExtent[1] + this.zExtent[0])/2,
        ];

        const cube: VoxelCube = { width, height, depth, center };
        return cube;

    }

    public index_new_point( pointCloudName: string, pointIndex: number ): void{

        if( !(pointCloudName in this.pointCloudIndices) ){
            this.pointCloudIndices[pointCloudName] = new Set();
        }
        
        this.pointCloudIndices[pointCloudName].add(pointIndex);
    }

    public is_point_cloud_indexed( pointCloudName: string ): boolean {

        return ( pointCloudName in this.pointCloudIndices );
    
    }

    public get_point_cloud_density( pointCloudName: string ): number {

        return this.pointCloudIndices[pointCloudName].size;
    
    }

    public get_point_cloud_indices( pointCloudName: string ): number[]{

        if( !(pointCloudName in this.pointCloudIndices) ) return [];
        return Array.from(this.pointCloudIndices[pointCloudName]);

    }

}