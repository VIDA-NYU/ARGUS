
import { WorldPointCloud } from "../model/WorldPointCloud";
import { DataUtils } from "../utils/DataUtils";

export class DataLoader {

    public static load_3D_data( sceneData: any ): void {

        // parsed datasets
        const datasets: { [datasetName: string]: any  } = {};

        // initializing dataset
        if( 'pointCloudData' in sceneData && 'world' in sceneData.pointCloudData ){

            // loading world point cloud
            const worldPointCloud: WorldPointCloud = DataUtils.parse_world_point_cloud_data( sceneData.pointCloudData['world'] );

            // 
        }

        if( 'pointCloudData' in sceneData && 'gaze' in sceneData.pointCloudData ){

            
        }

        if( 'pointCloudData' in sceneData && 'hand' in sceneData.pointCloudData ){


        }

    } 
}