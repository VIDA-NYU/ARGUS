// apis
// import { StreamAPI } from "../../../api/streams/stream.api";

// utils
// import { DataUtils } from "../../../utils/DataUtils";
import { DataUtils  } from "../utils/DataUtils";

// model
// import { GazePointCloudRaw, WorldPointCloudRaw } from "../../../types/DataTypes";
<<<<<<<< HEAD:frontend/src/components/PointCloudViewerBAK/model/Dataset.ts
// import { GazePointCloudRaw, WorldPointCloudRaw } from "../../../types/types";
========
import { GazePointCloudRaw, WorldPointCloudRaw } from "../types/types";
>>>>>>>> ab77e47 (fixing intervenor imports):frontend/src/components/PointCloudViewerBak/model/Dataset.ts

import { WorldPointCloud } from "./WorldPointCloud";
import { GazePointCloud } from "./GazePointCloud";

export class Dataset {

    // world point cloud object
    public worldPointCloud!: WorldPointCloud;

    // gaze point cloud object
    public gazePointCloud!: GazePointCloud;

    constructor(){}

    // public initialize_world_pointcloud_dataset( worldPointCloudRaw: WorldPointCloudRaw[] ): void {
    //     this.worldPointCloud = this.parse_world_point_cloud( worldPointCloudRaw );
    // }

    // public initialize_gaze_point_cloud_dataset( gazePointCloudRaw: GazePointCloudRaw[] ): void {
    //     this.gazePointCloud = this.parse_gaze_point_cloud( gazePointCloudRaw );
    // }

    // public async initialize_dataset( worldPointCloudRaw: WorldPointCloudRaw[] = [], gazePointCloudRaw: GazePointCloudRaw[] = [] ): Promise<any> {
        
    //     console.log('downloading...');
    //     // const worldPointCloudRaw: WorldPointCloudRaw[] = await StreamAPI.get_scene_point_cloud();
    //     // const gazePointCloudRaw: any = await StreamAPI.get_gaze_point_cloud();

    //     if( worldPointCloudRaw.length > 0 ){
    //         this.worldPointCloud = this.parse_world_point_cloud( worldPointCloudRaw );
    //     }

    //     if( gazePointCloudRaw.length > 0 ){
    //         this.gazePointCloud = this.parse_gaze_point_cloud( gazePointCloudRaw );
    //     }

    //     // console.log('parsing...');
    //     // const [worldPointCloud, gazePointCloud]: [WorldPointCloud, GazePointCloud] = this.parse_point_clouds( worldPointCloudRaw, gazePointCloudRaw );
        
    //     // // saving datasets
    //     // this.worldPointCloud = worldPointCloud;
    //     // this.gazePointCloud = gazePointCloud;

    // }   

    // public parse_gaze_point_cloud( gazePointCloudRaw: GazePointCloudRaw[] = [] ): GazePointCloud {

    //     const gazePointCloud: GazePointCloud = DataUtils.parse_gaze_point_cloud_data( gazePointCloudRaw );
    //     return gazePointCloud;

    // }

    // public parse_world_point_cloud( worldPointCloudRaw: WorldPointCloudRaw[] = [] ): WorldPointCloud {
        
    //     const worldPointCloud: WorldPointCloud = DataUtils.parse_world_point_cloud_data( worldPointCloudRaw );
    //     return worldPointCloud;

    // }

    // public parse_point_clouds( worldPointCloudRaw: WorldPointCloudRaw[] = [], gazePointCloudRaw: GazePointCloudRaw[] = [] ): [WorldPointCloud, GazePointCloud] {

    //     // Scene Point Cloud  Summaries
    //     const worldPointCloud: WorldPointCloud = DataUtils.parse_world_point_cloud_data( worldPointCloudRaw );
    //     const gazePointCloud: GazePointCloud = DataUtils.parse_gaze_point_cloud_data( gazePointCloudRaw );

    //     return [worldPointCloud, gazePointCloud];


    // }

}