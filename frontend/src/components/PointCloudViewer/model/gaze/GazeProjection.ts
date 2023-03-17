// model
import { Scene } from "../Scene";

// third-party
import * as THREE from 'three';

export class GazeProjection  {

    public projectedPoints: number[][] = [];

    constructor( public coords: number[][], public directions: number[][], public timestamps: number[] ){}

    public add_to_scene( scene: THREE.Scene ){

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.projectedPoints.flat(), 3 ) );
        pointgeometry.computeBoundingBox();

        // defining material
        const pointmaterial: THREE.PointsMaterial = new THREE.PointsMaterial( { size: 0.015, color: 'red' } );
        const points = new THREE.Points( pointgeometry, pointmaterial );        
        points.userData = { timestamps: this.timestamps, origins: this.coords  };

        // adding to scene
        points.name = 'projectedgazepointcloud'
        scene.add( points );

    }

    public generate_gaze_projection( scene: Scene ):  void {

        // const projectedPoints: number[][] = [];

        // for(let i = 0; (i < this.coords.length) && (i < this.directions.length); i++ ){

        //     const originVector: THREE.Vector3 = new THREE.Vector3( this.coords[i][0], this.coords[i][1], this.coords[i][2] );
        //     const directionVector: THREE.Vector3 = new THREE.Vector3( this.directions[i][0], this.directions[i][1], this.directions[i][2] );

        //     const worldIntersect: THREE.Vector3 = scene.rayCaster.get_intersected_world_point( originVector, directionVector );

        //     if( worldIntersect.toArray()[0] === 0 && worldIntersect.toArray()[1] === 0 && worldIntersect.toArray()[2] === 0 ){
        //         // TODO: Change it. I'm just repeating a previous point whenever the intersection is not found
        //         projectedPoints.push(projectedPoints[ Math.floor(Math.random()*projectedPoints.length) ]);
        //     }else {
        //         projectedPoints.push(worldIntersect.toArray());
        //     }

        // }

        // // saving ref
        // this.projectedPoints = projectedPoints;

        // // adding to scene
        // this.add_to_scene( scene.scene );

    }

}