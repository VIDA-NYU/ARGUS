

import { HandPointCloud } from "../model/renderables/hand/HandPointCloud";
import { GazeOriginPointCloud } from "../model/renderables/gaze/GazeOriginPointCloud";
import { PointCloud } from "../model/renderables/PointCloud";
import { WorldPointCloud } from "../model/renderables/world/WorldPointCloud";
import { DataParser } from "../utils/DataParser";
import { BASE_COLORS } from "../constants/Constants";

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
}