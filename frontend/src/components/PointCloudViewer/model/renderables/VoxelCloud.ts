import { VoxelCube } from "../../types/types";
import { VoxelCell } from "../voxel/VoxelCell";

// third party 
import * as d3 from 'd3';
import { BASE_SCALES } from "../../constants/Constants";

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

    public color_voxel_cells_by_model_confidence(): void {

    }

    public color_voxel_cells_by_density( pointCloudName: string ): void {

        const pointDensity: number[] = this.voxelCells.map( (voxelCell: VoxelCell) => voxelCell.get_point_cloud_density(pointCloudName));
        const extent: number[] = d3.extent(pointDensity);

        // creating color scale
        const colorScale: d3.ScaleSequential<any, any> = 
            d3.scaleSequential()
                .domain(extent)
                .interpolator(BASE_SCALES[this.name]);

        const colors: number[][] = [];
        pointDensity.forEach( (density: number) => {

            const color: any = d3.color(colorScale(density));
            const formatedColor: number[] = [ color.r/255, color.g/255, color.b/255 ];
            colors.push( formatedColor );
        });

        this.colors = colors;

    }
}