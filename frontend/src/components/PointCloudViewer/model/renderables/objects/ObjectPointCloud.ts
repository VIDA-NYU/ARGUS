import { Object3D, Vector3 } from "three";
import { Dataset } from "../../Dataset";
import { Raycaster } from "../../raycaster/Raycaster";
import { PointCloud } from "../PointCloud";

// third-party
import * as THREE from 'three';
import { BASE_COLORS } from "../../../constants/Constants";

export class ObjectPointCloud extends PointCloud {

    // highlights
    private highlightObjects: { [name: string]: Object3D } = {};

    constructor(public name: string, public points: number[][], public colors: number[][], public normals: number[][], public timestamps: number[] ){

        // initializing super class
        super(name, points, colors, normals, timestamps);

    }

    public initialize_highlights(): void {

        // Point highlight
        const originColor: THREE.Color = new THREE.Color( BASE_COLORS[this.name][0], BASE_COLORS[this.name][1], BASE_COLORS[this.name][2] );
        const originSphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const originSphereMaterial = new THREE.MeshBasicMaterial( { color: originColor } );

        this.highlightObjects['intersectSphere'] = new THREE.Mesh( originSphereGeometry, originSphereMaterial );

    }

    public highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number { 

        // making objects visible
        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = true );

        const pointIndex: number = intersects[0].index; 
        const pointVector: THREE.Vector3 = new Vector3( this.points[pointIndex][0], this.points[pointIndex][1], this.points[pointIndex][2] );

        this.highlightObjects['intersectSphere'].position.copy(pointVector);

        return this.timestamps[pointIndex];

    }

    public offlight(): void {

        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = false );

    }

    public get_highlight_objects(): Object3D[] { 

        return Object.values(this.highlightObjects);

     }

}