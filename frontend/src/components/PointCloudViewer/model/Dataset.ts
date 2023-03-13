// utils
import { DataUtils  } from "../utils/DataUtils";

// model
import { GazePointCloudRaw, WorldPointCloudRaw } from "../types/types";

import { WorldPointCloud } from "./WorldPointCloud";
import { GazePointCloud } from "./gaze/GazePointCloud";

export class Dataset {

    // world point cloud object
    public worldPointCloud!: WorldPointCloud;
    public gazePointCloud!: GazePointCloud;

    constructor(){}

    public initialize_world_pointcloud_dataset( worldPointCloudRaw: WorldPointCloudRaw ): void {
        this.worldPointCloud = this.parse_world_point_cloud( worldPointCloudRaw );
    }  
    
    public initialize_gaze_pointcloud_dataset( gazePointCloudRaw: GazePointCloudRaw[] ): void {
        this.gazePointCloud = this.parse_gaze_point_cloud( gazePointCloudRaw );
    }  

    private parse_world_point_cloud( worldPointCloudRaw: WorldPointCloudRaw): WorldPointCloud {
        
        const worldPointCloud: WorldPointCloud = DataUtils.parse_world_point_cloud_data( worldPointCloudRaw );
        return worldPointCloud;

    }

    private parse_gaze_point_cloud( gazePointCloudRaw: GazePointCloudRaw[] ): GazePointCloud {
        
        const gazePointCloud: GazePointCloud = DataUtils.parse_gaze_point_cloud_data( gazePointCloudRaw );
        return gazePointCloud;
    }


}