// model
import { PointCloud } from "../PointCloud";

// third-party
import * as THREE from 'three';
import { Object3D } from "three";

// constants
import { BASE_COLORS } from "../../../constants/Constants";

// model
import { Raycaster } from "../../raycaster/Raycaster";
import { Dataset } from "../../Dataset";

export class GazeOriginPointCloud extends PointCloud {

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

        // Point highlight
        const destinationColor: THREE.Color = new THREE.Color( BASE_COLORS['gazeprojection-pointcloud'][0], BASE_COLORS['gazeprojection-pointcloud'][1], BASE_COLORS['gazeprojection-pointcloud'][2] );
        const destinationSphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const destinationSphereMaterial = new THREE.MeshBasicMaterial( { color: destinationColor } );

        // Direction highlight
        const lineMaterial = new THREE.LineBasicMaterial({ color: originColor, linewidth: 5 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3( 0,0,0 ), new THREE.Vector3( 0,0,0 )] );

        // saving refs
        this.highlightObjects['originIntersectSphere'] = new THREE.Mesh( originSphereGeometry, originSphereMaterial );
        this.highlightObjects['destinationIntersectSphere'] = new THREE.Mesh( destinationSphereGeometry, destinationSphereMaterial );
        this.highlightObjects['gazeDirectionLine'] = new THREE.Line( lineGeometry, lineMaterial );

    }

    public highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number {

        // making objects visible
        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = true );

        const pointIndex: number = intersects[0].index; 
        const pointProjection: number[] = dataset.pointClouds['gazeprojection-pointcloud'].points[pointIndex];

        const originVector: THREE.Vector3 = new THREE.Vector3( this.points[pointIndex][0], this.points[pointIndex][1], this.points[pointIndex][2] );
        const destinationVector: THREE.Vector3 = new THREE.Vector3( pointProjection[0], pointProjection[1], pointProjection[2] );

        this.highlightObjects['originIntersectSphere'].position.copy(originVector);
        this.highlightObjects['destinationIntersectSphere'].position.copy(destinationVector);
        (this.highlightObjects['gazeDirectionLine'] as THREE.Line).geometry = new THREE.BufferGeometry().setFromPoints( [originVector, destinationVector ] );   

        return this.timestamps[pointIndex];

    }

    public offlight(): void {

        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = false );

    }

    public get_highlight_objects(): Object3D[] {

        return Object.values(this.highlightObjects);
    
    }

}