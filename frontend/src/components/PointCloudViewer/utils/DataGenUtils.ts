import { GazePointCloud } from "../model/GazePointCloud";
import { Scene } from "../model/Scene";

import * as THREE from 'three';

export class DataGenUtils {

    public static generate_gaze_projection( scene: Scene, gazePointCloud: GazePointCloud ): number[][] {

        const gazeOrigins: number[][] = gazePointCloud.points;
        const gazeDirections: number[][] = gazePointCloud.normals;
        const projectedPoints: number[][] = [];

        for(let i = 0; (i < gazeOrigins.length) && (i < gazeDirections.length); i++ ){

            const originVector: THREE.Vector3 = new THREE.Vector3( gazeOrigins[i][0], gazeOrigins[i][1], gazeOrigins[i][2] );
            const directionVector: THREE.Vector3 = new THREE.Vector3( gazeDirections[i][0], gazeDirections[i][1], gazeDirections[i][2] );

            
            const worldIntersect: THREE.Vector3 = scene.rayCaster.get_intersected_world_point( originVector, directionVector );
            projectedPoints.push(worldIntersect.toArray());

        }

        return projectedPoints;

    }

}