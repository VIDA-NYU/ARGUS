// model
import { Object3D, Event } from 'three';
import { Dataset } from '../../Dataset';
import { Raycaster } from '../../raycaster/Raycaster';
import { PointCloud } from '../PointCloud';
import * as THREE from 'three';

export class WorldPointCloud extends PointCloud {

    // highlights
    private highlightObjects: { [name: string]: Object3D } = {};

    constructor( public name: string, public points: number[][], public colors: number[][], public normals: number[][] ){
        
        // initializing super class
        super(name, points, colors, normals, []);

        // interactive
        this.interactive = false;

    }
    
    public initialize_highlights(): void {

        // // Point highlight
        // const color: THREE.Color = new THREE.Color( 0.215, 0.494, 0.721 );
        // const sphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        // const sphereMaterial = new THREE.MeshBasicMaterial( { color: color } );

        // // saving refs
        // this.highlightObjects['worldIntersectSphere'] = new THREE.Mesh( sphereGeometry, sphereMaterial );
        
    }

    public highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number { 

        // const point: THREE.Vector3 = intersects[0].point;
        // this.highlightObjects['worldIntersectSphere'].position.copy(point);

        return -1;
    }

    public offlight(): void {}

    public get_highlight_objects(): Object3D[] { 

        return Object.values(this.highlightObjects);

     }




}