

import { HandPointCloud } from "../model/renderables/hand/HandPointCloud";
import { GazeOriginPointCloud } from "../model/renderables/gaze/GazeOriginPointCloud";
import { PointCloud } from "../model/renderables/PointCloud";
import { WorldPointCloud } from "../model/renderables/world/WorldPointCloud";
import { DataParser } from "../utils/DataParser";
import { BASE_COLORS } from "../constants/Constants";
import { Raycaster } from "../model/raycaster/Raycaster";
import { GazeProjectionPointCloud } from "../model/renderables/gaze/GazeProjectionPointCloud";
import * as THREE from 'three';

export class DataLoader {

    public static load_point_clouds( sceneData: any ): { [datasetName: string]: PointCloud  } {

        // parsed datasets
        const pointClouds: { [datasetName: string]: PointCloud  } = {};

        // initializing dataset
        if( 'pointCloudData' in sceneData && 'world' in sceneData.pointCloudData ){

            // loading world point cloud
            const worldPointCloud: WorldPointCloud = DataParser.parse_world_point_cloud_data( sceneData.pointCloudData['world'] );
            pointClouds['world-pointcloud'] = worldPointCloud;

        }

        if( 'pointCloudData' in sceneData && 'gaze' in sceneData.pointCloudData ){

            const gazeOriginPointCloud: GazeOriginPointCloud = DataParser.parse_gaze_point_cloud_data( sceneData.pointCloudData['gaze'] );
            gazeOriginPointCloud.baseColor = BASE_COLORS['gazeorigin-pointcloud'];
            pointClouds['gazeorigin-pointcloud'] = gazeOriginPointCloud;
            
        }

        if( 'pointCloudData' in sceneData && 'hand' in sceneData.pointCloudData ){

            const leftHandPointCloud: HandPointCloud = DataParser.parse_hand_point_cloud_data( sceneData.pointCloudData['hand'], 'left' );
            const rightHandPointCloud: HandPointCloud = DataParser.parse_hand_point_cloud_data( sceneData.pointCloudData['hand'], 'right' );

            leftHandPointCloud.baseColor = BASE_COLORS['lefthands-pointcloud'];
            rightHandPointCloud.baseColor = BASE_COLORS['righthands-pointcloud'];

            pointClouds['lefthands-pointcloud'] = leftHandPointCloud;
            pointClouds['righthands-pointcloud'] = rightHandPointCloud;

        }

        return pointClouds;

    } 

    public static project_point_cloud( name, originPointCloud: PointCloud, targetPointCloud: PointCloud, raycaster: Raycaster ): PointCloud {

        const points: number[][] = [];
        const timestamps: number[] = [];
        
        // Using the normal vector is the direction vector. If none is provided, we can't calculate the projection.
        if(originPointCloud.normals.length === 0) return new GazeProjectionPointCloud( name, [], [], [], []);

        for(let i = 0; (i < originPointCloud.points.length) && (i < originPointCloud.normals.length); i++ ){
            
            const origin: THREE.Vector3 = new THREE.Vector3( originPointCloud.points[i][0], originPointCloud.points[i][1], originPointCloud.points[i][2]  );
            const direction: THREE.Vector3 = new THREE.Vector3( originPointCloud.normals[i][0], originPointCloud.normals[i][1], originPointCloud.normals[i][2]  );

            // normalizing direction
            direction.normalize();

            // const rayDirection: THREE.Vector3 = origin.clone().add( direction );
            const intersections: THREE.Vector3[] = raycaster.calculate_point_cloud_intersection( origin, direction, targetPointCloud );
            points.push(intersections[0].toArray());
            timestamps.push(originPointCloud.timestamps[i]);
            
        }       

        return new GazeProjectionPointCloud( name, points, [], [], timestamps );

    }

    public static load_perception_data( rawPerception: any[] ): { [timestamp: number]: { [className: string]: number }} {

        const indexedPerception: { [timestamp: number]: { [className: string]: number }} = {};

        rawPerception.forEach( (row: any) => {

            const timestamp: number = parseInt(row.timestamp.split('-')[0]); 

            const rowIndex: { [className: string]: number } = {};
            const rowData: any[] = row.data;

            rowData.forEach( (labelInfo: any) => {

                const label: string = labelInfo.label;
                const confidence: number = labelInfo.confidence;

                if( !(label in rowIndex) ){
                    rowIndex[label] = confidence;
                }
                rowIndex[label] = Math.max(rowIndex[label], confidence);

            });

            indexedPerception[timestamp] = rowIndex;

        });
    
        return indexedPerception;

    } 



}