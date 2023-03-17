import { Object3D } from "three";
import { BASE_COLORS } from "../../constants/Constants";
import { DataUtils } from "../../utils/DataUtils";
import { Dataset } from "../Dataset";
import { Raycaster } from "../raycaster/Raycaster";

export abstract class PointCloud {

    public extent: number[][];
    public threeObject!: THREE.Points;

    public baseColor: number[] = [];

    // Interactive flag
    public interactive: boolean = true;

    constructor( public name: string, public points: number[][], public colors: number[][], public normals: number[][] ){

        // calculating extent
        this.extent = DataUtils.calculate_extents( points );

        if( colors.length === 0 ){
            this.fill_colors();
        }
        
    }

    // abstract methods
    public abstract highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number;
    public abstract offlight();
    public abstract initialize_highlights(): void;
    public abstract get_highlight_objects(): Object3D[];


    public fill_colors(): void {

        this.points.map( (point: number[] ) => this.colors.push( BASE_COLORS[this.name] ))

    }

    public get_base_color(): number[] {

        if(this.baseColor.length === 0){
            return [0, 0, 0];
        }
        return this.baseColor;
    }

    public get_extent(): number[][] {

        return this.extent;
    
    }

    public get_buffer_positions(): [number[], number[], number[]] {
         
        return [ this.points.flat(), this.colors.flat(), this.normals.flat() ];
    
    }



}