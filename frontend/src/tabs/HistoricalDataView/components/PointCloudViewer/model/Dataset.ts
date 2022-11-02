// apis
// import { StreamAPI } from "../../../api/streams/stream.api";

// utils
// import { DataUtils } from "../../../utils/DataUtils";
import { DataUtils  } from "../utils/DataUtils";

// model
// import { GazePointCloudRaw, WorldPointCloudRaw } from "../../../types/DataTypes";
import { GazePointCloudRaw, WorldPointCloudRaw } from "../../../types/types";

import { WorldPointCloud } from "./WorldPointCloud";
import { GazePointCloud } from "./GazePointCloud";

export class Dataset {

    // world point cloud object
    public worldPointCloud!: WorldPointCloud;

    // gaze point cloud object
    public gazePointCloud!: GazePointCloud;

    constructor(){}

    public async initialize_dataset( worldPointCloudRaw: WorldPointCloudRaw[], gazePointCloudRaw: any = [] ): Promise<any> {
        
        console.log('downloading...');
        // const worldPointCloudRaw: WorldPointCloudRaw[] = await StreamAPI.get_scene_point_cloud();
        // const gazePointCloudRaw: any = await StreamAPI.get_gaze_point_cloud();

        console.log('parsing...');
        const [worldPointCloud, gazePointCloud]: [WorldPointCloud, GazePointCloud] = this.parse_point_clouds( worldPointCloudRaw, gazePointCloudRaw );
        
        // saving datasets
        this.worldPointCloud = worldPointCloud;
        this.gazePointCloud = gazePointCloud;

    }   

    public parse_point_clouds( worldPointCloudRaw: WorldPointCloudRaw[] = [], gazePointCloudRaw: GazePointCloudRaw[] = [] ): [WorldPointCloud, GazePointCloud] {

        // Scene Point Cloud  Summaries
        const worldPointCloud: WorldPointCloud = DataUtils.parse_world_point_cloud_data( worldPointCloudRaw );
        const gazePointCloud: GazePointCloud = DataUtils.parse_gaze_point_cloud_data( gazePointCloudRaw );

        return [worldPointCloud, gazePointCloud];


    }

}