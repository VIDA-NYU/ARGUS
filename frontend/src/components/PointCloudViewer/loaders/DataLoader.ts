

import { HandPointCloud } from "../model/renderables/hand/HandPointCloud";
import { GazeOriginPointCloud } from "../model/renderables/gaze/GazeOriginPointCloud";
import { PointCloud } from "../model/renderables/PointCloud";
import { WorldPointCloud } from "../model/renderables/world/WorldPointCloud";
import { DataParser } from "../utils/DataParser";
import { BASE_COLORS } from "../constants/Constants";
import { Raycaster } from "../model/raycaster/Raycaster";
import { GazeProjectionPointCloud } from "../model/renderables/gaze/GazeProjectionPointCloud";
import * as THREE from 'three';
import { ObjectPointCloud } from "../model/renderables/objects/ObjectPointCloud";
import { LineCloud } from "../model/renderables/LineCloud";
import { GazeProjectionLineCloud } from "../model/renderables/gaze/GazeProjectionLineCloud";
import { VoxelCloud } from "../model/renderables/VoxelCloud";
import { WorldVoxelGrid } from "../model/voxel/WorldVoxelGrid";
import { VoxelCell } from "../model/voxel/VoxelCell";
import TimestampManager from "../../../tabs/HistoricalDataView/services/TimestampManager";
import * as d3 from 'd3';

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

    public static create_object_point_cloud( name: string, className: string, indexedPerception3D: { [timestamp: number]: { [className: string]: {confidence: number, position: number[] } }} ): PointCloud {

        const points: number[][] = [];
        const colors: number[][] = [];
        const timestamps: number[] = [];
        
        for (const [timestamp, value] of Object.entries(indexedPerception3D)) {

            if( className in value ){

                points.push( value[className].position );
                colors.push( BASE_COLORS[name] );
                timestamps.push( parseInt(timestamp) );
            
            }
        }

        const objectPointCloud: PointCloud = new ObjectPointCloud(name, points, colors, [], timestamps);
        return objectPointCloud;

    }

    public static create_gaze_projection_line_cloud( name: string, origin: PointCloud, destination: PointCloud ): LineCloud {

        const originPoints: number[][] = [];
        const destinationPoints: number[][] = [];
        const colors: number[][] = [];
        const timestamps: number[] = [];

        for(let i = 0; ( i < origin.points.length ) && ( i < destination.points.length); i++ ){

            originPoints.push( origin.points[i] );
            destinationPoints.push( destination.points[i] );
            colors.push( BASE_COLORS['default'] );
            timestamps.push( (origin.timestamps[i] + destination.timestamps[i]) / 2 )

            // TODO: Removing it. Here for debugging purposes
            if( !( origin.timestamps[i] === destination.timestamps[i] )) console.log( 'Different timestamps ');

        }

        return new GazeProjectionLineCloud( name, originPoints, destinationPoints, colors, timestamps );

    } 

    public static create_occupancy_voxel_cloud( pointCloud: PointCloud, modelType: string, modelData: { [timestamp: number]: any }, worldVoxelGrid: WorldVoxelGrid ): VoxelCloud {

        const pointCloudVoxelCells: VoxelCell[] = worldVoxelGrid.get_point_cloud_voxel_cells( pointCloud.name );
        const voxelCloud: VoxelCloud = new VoxelCloud( `occupancy-voxelcloud`, pointCloudVoxelCells );

        // retrieving cell indices
        const cellIndices: number[][] = voxelCloud.get_cell_indices( pointCloud.name );
    
        const voxelCloudCounters: number[] = [];
        for(let i = 0; i < cellIndices.length; i++){

            const cellCounter: number[] = [];
            for(let j = 0; j < cellIndices[i].length; j++){
                
                const currentIndex: number = cellIndices[i][j];
                const currentTimestamp: number = pointCloud.timestamps[currentIndex]
                const closestModelTimestamp: number = TimestampManager.get_closest_timestamp( modelType, currentTimestamp );

                cellCounter.push( Object.keys(modelData[closestModelTimestamp]).length );

            }

            voxelCloudCounters.push(d3.mean(cellCounter));
        }

        voxelCloud.color_voxel_cells_by_measurement( voxelCloudCounters );

        return voxelCloud;

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

    public static load_perception_3D_data( raw3DPerception: any[] ): { [timestamp: number]: { [className: string]: {confidence: number, position: number[] } }} {

        const indexed3DPerception: { [timestamp: number]: { [className: string]: {confidence: number, position: number[] } }} = {};

        raw3DPerception.forEach( (row: any) => {

            const currentTimestamp: number = parseInt(row.timestamp.split('-')[0]);
            if( !(currentTimestamp in indexed3DPerception) ) indexed3DPerception[currentTimestamp] = {};
            
            row.values.forEach( (classInfo: any) => {

                const className: string = classInfo.label;
                const classConfidence: number = classInfo.confidence;
                const objectPosition: number[] = classInfo.xyz_center;

                indexed3DPerception[currentTimestamp][className] = { 'confidence': classConfidence, position: objectPosition };

            });

        });
    
        return indexed3DPerception;

    } 

}