// model
import { Object3D, Event } from 'three';
import { Dataset } from '../../Dataset';
import { Raycaster } from '../../raycaster/Raycaster';
import { PointCloud } from '../PointCloud';

export class WorldPointCloud extends PointCloud {

    constructor( public name: string, public points: number[][], public colors: number[][], public normals: number[][] ){

        // initializing super class
        super(name, points, colors, normals);

        // interactive
        this.interactive = false;

    }
    
    public initialize_highlights(): void {
        
    }

    public highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number { return 0;}

    public offlight(): void {}

    public get_highlight_objects(): Object3D[] { return []; }




}