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
        const color: THREE.Color = new THREE.Color( BASE_COLORS[this.name][0], BASE_COLORS[this.name][1], BASE_COLORS[this.name][2] );
        const sphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: color } );

        // Direction highlight
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 5 });
        const redlineMaterial = new THREE.LineBasicMaterial({ color: '#f54251', linewidth: 5 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3( 0,0,0 ), new THREE.Vector3( 0,0,0 )] );

        // saving refs
        this.highlightObjects['gazeIntersectSphere'] = new THREE.Mesh( sphereGeometry, sphereMaterial );
        this.highlightObjects['precomputedGazeDirectionLine'] = new THREE.Line( lineGeometry, redlineMaterial );
        this.highlightObjects['gazeDirectionLine'] = new THREE.Line( lineGeometry, lineMaterial );

    }

    public highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number {

        // making objects visible
        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = true );

        const pointIndex: number = intersects[0].index; 
        const point: THREE.Vector3 = intersects[0].point;

        // const point: THREE.Vector3 = new THREE.Vector3( this.points[pointIndex][0], this.points[pointIndex][1], this.points[pointIndex][2] );
        
        // const projectedPoint: number[] = dataset.pointClouds['gazeprojection-pointcloud'].points[pointIndex];
        // const projectedPoint: THREE.Vector3 = intersects[0].point;        

        // const preComputedDirection = new THREE.Vector3( projectedPoint[0], projectedPoint[1], projectedPoint[2] );
        const direction: THREE.Vector3 = new THREE.Vector3( this.normals[pointIndex][0], this.normals[pointIndex][1], this.normals[pointIndex][2] );
        direction.normalize();


        const intersections: THREE.Vector3[] = raycaster.calculate_point_cloud_intersection( point, direction, dataset.pointClouds['world-pointcloud'] );

        this.highlightObjects['gazeIntersectSphere'].position.copy(point);


        // (this.highlightObjects['precomputedGazeDirectionLine'] as THREE.Line).geometry = new THREE.BufferGeometry().setFromPoints( [point, preComputedDirection ] );       
        (this.highlightObjects['gazeDirectionLine'] as THREE.Line).geometry = new THREE.BufferGeometry().setFromPoints( [point, intersections[0] ] );   

        return this.timestamps[pointIndex];

    }

    public offlight(): void {

        Object.values( this.highlightObjects ).forEach( (object: Object3D) => object.visible = false );

    }

    public get_highlight_objects(): Object3D[] {

        return Object.values(this.highlightObjects);
    
    }

}