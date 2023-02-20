// import { GazePointCloudRaw, WorldPointCloudRaw } from "../types/DataTypes";
import { GazePointCloudRaw, WorldPointCloudRaw } from '../types/types';

// third-party
import * as d3 from 'd3';

// model
// import { WorldPointCloud } from "../components/PointCloudViewer/model/WorldPointCloud";
// import { GazePointCloud } from "../components/PointCloudViewer/model/GazePointCloud";

import { WorldPointCloud } from '../model/WorldPointCloud';
import { GazePointCloud } from '../model/GazePointCloud';

export class DataUtils {

    public static parse_world_point_cloud_data( dataset: any[] ): WorldPointCloud {

        const points: number[][] = [];
        const colors: number[][] = [];

        // console.log(dataset.length);

        dataset.forEach( (timestamp: any) => {
            for(let i = 0; i < timestamp.xyz_world.length; i++){
                points.push(timestamp.xyz_world[i])
                colors.push([timestamp.color[i][0]/255.0, timestamp.color[i][1]/255.0, timestamp.color[i][2]/255.0 ])
            }    
        })

        // creating world point cloud object
        const worldPointCloud: WorldPointCloud = new WorldPointCloud(points, colors);
        return worldPointCloud;

    }   
     
}