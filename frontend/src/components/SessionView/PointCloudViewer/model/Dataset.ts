// apis
// import { StreamAPI } from "../../../api/streams/stream.api";

// utils
// import { DataUtils } from "../../../utils/DataUtils";
import { DataUtils  } from "../utils/DataUtils";

// model
import { GazePointCloudRaw, WorldPointCloudRaw } from "../types/types";

import { WorldPointCloud } from "./WorldPointCloud";
import { GazePointCloud } from "./GazePointCloud";

export class Dataset {

    // world point cloud object
    public worldPointCloud!: WorldPointCloud;

    // gaze point cloud object
    public gazePointCloud!: GazePointCloud;

    constructor(){}

    public initialize_world_pointcloud_dataset( worldPointCloudRaw: WorldPointCloudRaw[] ): void {
        this.worldPointCloud = this.parse_world_point_cloud( worldPointCloudRaw );
    }   

    public parse_world_point_cloud( worldPointCloudRaw: WorldPointCloudRaw[] = [] ): WorldPointCloud {
        
        const worldPointCloud: WorldPointCloud = DataUtils.parse_world_point_cloud_data( worldPointCloudRaw );
        return worldPointCloud;

    }


}