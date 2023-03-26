import { VoxelCube } from "../../types/types";
import { VoxelCell } from "../voxel/VoxelCell";

// third party 
import * as d3 from 'd3';
import { BASE_SCALES } from "../../constants/Constants";

export class VoxelCloud {

    public threeObject!: THREE.Group;

    constructor( public name: string, public voxelCells: VoxelCell[], public colors: number[][] = [], public opacities: number[] = [] ){}

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

    public get_voxel_opacities(): number[] {

        if( this.opacities.length === 0 ){
            const opacities: number[] = this.voxelCells.map( (voxelCell: VoxelCell) => 0.5);
            return opacities;
        }

        return this.opacities;

    }

    public get_cell_indices( pointCloudName: string ): number[][] {

        const indices: number[][] = this.voxelCells.map( ( voxelCell: VoxelCell ) =>  voxelCell.get_point_cloud_indices(pointCloudName) );
        return indices;

    }


    public color_voxel_cells_by_model_confidence( confidences: number[][] ): void {

        // const extent: number[] = [0, d3.max( confidences, (confidence: number[] ) => d3.max(confidence) )];
        const extent: number[] = [0, 1];

        // creating color scale
        const colorScale: d3.ScaleSequential<any, any> = 
            d3.scaleSequential()
                .domain(extent)
                .interpolator(d3.interpolateReds);

        const colors: number[][] = [];
        this.voxelCells.forEach( (voxelCell: VoxelCell, index: number) => {

            let currentConfidence: number = 0;
            if(confidences.length !== 0){
                currentConfidence = d3.max( confidences[index] );
            }

            const color: any = d3.color(colorScale(currentConfidence));
            const formatedColor: number[] = [ color.r/255, color.g/255, color.b/255 ];
            colors.push( formatedColor );
        })

        this.colors = colors;

    }

    public color_voxel_cells_by_measurement( measurements: number[] ): void {

        /*
        * Users must provide one value per voxel cell
        *
        */

        const extent: number[] = [0, d3.max(measurements)];

        // creating color scale
        const colorScale: d3.ScaleSequential<any, any> = 
            d3.scaleSequential()
                .domain(extent)
                .interpolator(d3.interpolateReds);

        const colors: number[][] = [];
        this.voxelCells.forEach( (voxelCell: VoxelCell, index: number) => {

            const color: any = d3.color(colorScale(measurements[index]));
            const formatedColor: number[] = [ color.r/255, color.g/255, color.b/255 ];
            colors.push( formatedColor );
        
        });

        this.colors = colors;

    }

    public color_voxel_cells_by_density( pointCloudName: string ): void {

        const pointDensity: number[] = this.voxelCells.map( (voxelCell: VoxelCell) => voxelCell.get_point_cloud_density(pointCloudName));
        const extent: number[] = d3.extent(pointDensity);

        const opacityScale: d3.ScaleLinear<any, any> = 
            d3.scaleLinear()
                .domain( extent )
                .range( [0.1, 0.8] );

        // creating color scale
        const colorScale: d3.ScaleLogarithmic<any, any> = 
            d3.scaleLog()
                .domain(extent)
                .range(BASE_SCALES[this.name]);

        const colors: number[][] = [];
        const opacities: number[] = [];
        pointDensity.forEach( (density: number) => {

            const color: any = d3.color(colorScale(density));
            const formatedColor: number[] = [ color.r/255, color.g/255, color.b/255 ];
            colors.push( formatedColor );
            opacities.push( opacityScale(density) );

        });

        this.colors = colors;
        this.opacities = opacities;

    }
}