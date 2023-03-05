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

    public static parse_world_point_cloud_data( dataset: WorldPointCloudRaw ): WorldPointCloud {

        const points: number[][] = [];
        const colors: number[][] = [];

        

        // dataset.forEach( (timestamp: any) => {
        //     for(let i = 0; i < timestamp.xyz_world.length; i++){
        //         points.push(timestamp.xyz_world[i])
        //         colors.push([timestamp.color[i][0]/255.0, timestamp.color[i][1]/255.0, timestamp.color[i][2]/255.0 ])
        //     }    
        // })

        // creating world point cloud object
        const worldPointCloud: WorldPointCloud = new WorldPointCloud(dataset.xyz_world, dataset.colors);
        return worldPointCloud;

    }   


    public static parse_gaze_point_cloud_data( dataset: GazePointCloudRaw[] ): GazePointCloud {

        const points: number[][] = [];
        const normals: number[][] = [];
        const timestamps: number[] = [];

        dataset.forEach( (point: GazePointCloudRaw) => {

            // parsing points
            const currentPoint: number[] = [ point.GazeOrigin.x, point.GazeOrigin.y, (-1)*point.GazeOrigin.z ];
            const currentNormal: number[] = [ point.GazeDirection.x, point.GazeDirection.y, (-1)*point.GazeDirection.z ];

            // parsing timestamp
            const currentTimestamp: number = parseInt(point.timestamp.split('-')[0]); 

            // adding points and normal to arrays
            points.push( currentPoint );
            normals.push( currentNormal );
            timestamps.push( currentTimestamp );

        });

        return new GazePointCloud(points, normals, timestamps);

    }
     
}