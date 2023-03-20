// third-party
import * as THREE from 'three'
import { Object3D } from "three";
import { BASE_COLORS } from '../../../constants/Constants';
import { Dataset } from '../../Dataset';
import { Raycaster } from '../../raycaster/Raycaster';

// model
import { PointCloud } from "../PointCloud";

export class HandPointCloud extends PointCloud {

    // highlights
    private highlightObjects: { [name: string]: Object3D } = {};
    
    constructor(public name: string, public points: number[][], public colors: number[][], public normals: number[][], public timestamps: number[] ){

        // initializing super class
        super(name, points, colors, normals, timestamps);

    }

    public initialize_highlights(): void {

        const color: THREE.Color = new THREE.Color( BASE_COLORS[this.name][0], BASE_COLORS[this.name][1], BASE_COLORS[this.name][2] );
        const sphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: color } );
        this.highlightObjects['gazeIntersectSphere'] = new THREE.Mesh( sphereGeometry, sphereMaterial );
    }

    public highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number {

        // making objects visible
        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = true );
        
        const pointIndex: number = intersects[0].index;
        const point: THREE.Vector3 = new THREE.Vector3( this.points[pointIndex][0], this.points[pointIndex][1], this.points[pointIndex][2] );

        this.highlightObjects['gazeIntersectSphere'].position.copy(point);

        return this.timestamps[pointIndex];

    }

    public offlight(): void {

        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = false );

    }


    public get_highlight_objects(): Object3D[] {

        return Object.values(this.highlightObjects);

    }

}