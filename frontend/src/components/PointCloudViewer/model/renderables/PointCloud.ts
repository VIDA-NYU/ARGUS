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

    // visibility buffer
    public visibility: number[] = [];

    constructor( public name: string, public points: number[][], public colors: number[][], public normals: number[][], public timestamps: number[] ){

        // calculating extent
        this.extent = DataUtils.calculate_extents( points );

        if( colors.length === 0 ){
            this.fill_colors();
        }

        // initializing visibility buffer
        this.visibility = new Array( this.points.length ).fill( 1.0 );
        
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

    public filter_points_by_timestamp( timestamps: number[] ){

        for( let i = 0; i < this.timestamps.length; i++ ){
            if( this.timestamps[i] > timestamps[0] && this.timestamps[i] < timestamps[1] ){
                this.threeObject.geometry.attributes.visibility.setX( i, 1 );
            }else{
                this.threeObject.geometry.attributes.visibility.setX( i, 0 );
            }
        }

        this.threeObject.geometry.attributes.visibility.needsUpdate = true;
    }



}