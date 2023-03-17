import { VoxelCube } from "../../types/types";
import { VoxelCell } from "../voxel/VoxelCell";

export class VoxelCloud {

    public threeObject!: THREE.Group;

    constructor( public name: string, public voxelCells: VoxelCell[], public colors: number[][] = [] ){}

    public get_voxel_cubes(): VoxelCube[] {

        return this.voxelCells.map( (voxelCell: VoxelCell) => voxelCell.get_voxel_cube() );

    }

    public get_voxel_colors(): number[][] {

        if( this.colors.length === 0 ){
            const colors: number[][] = this.voxelCells.map( (voxelCell: VoxelCell) => [0,0,0]);
            return colors;
        }

        return this.colors;
    }

    public color_voxel_cells( color: number[] ): void {

        const colors: number[][] = [];
        this.voxelCells.forEach( (voxelCell: VoxelCell, index: number) => {
            colors.push(color);
        });

        if( this.threeObject ){
            console.log('COLOR THREE OBJECT');
        }

        this.colors = colors;

    }
}