// import { GazePointCloudRaw, WorldPointCloudRaw } from "../types/DataTypes";
import { GazePointCloudRaw, WorldPointCloudRaw } from '../types/types';
import { WorldPointCloud } from '../model/renderables/world/WorldPointCloud';
import { DataUtils } from './DataUtils';
import { GazeOriginPointCloud } from '../model/renderables/gaze/GazeOriginPointCloud';
import { HandPointCloud } from '../model/renderables/hand/HandPointCloud';

export class DataParser {

    public static parse_world_point_cloud_data( dataset: WorldPointCloudRaw ): WorldPointCloud {

        // TODO: Read this bounding box from constants
        const xyz: number[][] = [];
        const colors: number[][] = [];

        if( !('xyz_world' in dataset) ) return new WorldPointCloud('world-pointcloud', xyz, colors, []);

        dataset.xyz_world.forEach( (coord: number[],  index: number) => {
            if(coord[1] <= -0.39 || coord[1] >= -0.018){
                xyz.push(coord);
                colors.push(dataset.colors[index]);
            }
        })

        // // creating world point cloud object
        // const worldPointCloud: WorldPointCloud = new WorldPointCloud('world-pointcloud', dataset.xyz_world, dataset.colors, []);
        const worldPointCloud: WorldPointCloud = new WorldPointCloud('world-pointcloud', xyz, colors, []);
        return worldPointCloud;

    }   

    public static parse_hand_point_cloud_data( dataset: any[], side: string ): HandPointCloud {

        const points: number[][] = [];
        const colors: number[][] = [];
        const normals: number[][] = [];
        const timestamps: number[] = [];

        dataset.forEach( (point: any) => {

            const currentTimestamp: number = DataUtils.hololens_timestamp_parser( point.timestamp );

            const joints: any[] = (point[side]).items;
            const palmInfo: any = joints.filter( (joint: any) => joint.joint === 'Palm');
            const currentPoint: number[] = [ palmInfo[0].pose.position.x, palmInfo[0].pose.position.y, (-1)*palmInfo[0].pose.position.z ];

            // adding points and normal to arrays
            points.push( currentPoint );
            timestamps.push( currentTimestamp );

        });

        return new HandPointCloud( `${side}hands-pointcloud`, points, colors, normals, timestamps );

    }

    public static parse_gaze_point_cloud_data( dataset: GazePointCloudRaw[] ): GazeOriginPointCloud {

        const points: number[][] = [];
        const colors: number[][] = [];
        const normals: number[][] = [];
        const timestamps: number[] = [];

        dataset.forEach( (point: GazePointCloudRaw) => {

            // parsing points
            const currentPoint: number[] = [ point.GazeOrigin.x, point.GazeOrigin.y, (-1)*point.GazeOrigin.z ];
            const currentNormal: number[] = [ point.GazeDirection.x, point.GazeDirection.y, (-1)*point.GazeDirection.z ];

            // const currentPoint: number[] = [ point.GazeOrigin.x, point.GazeOrigin.y, point.GazeOrigin.z ];
            // const currentNormal: number[] = [ point.GazeDirection.x, point.GazeDirection.y, point.GazeDirection.z ];

            // parsing timestamp
            const currentTimestamp: number = DataUtils.hololens_timestamp_parser( point.timestamp );

            // adding points and normal to arrays
            points.push( currentPoint );
            normals.push( currentNormal );
            timestamps.push( currentTimestamp );

        });

        return new GazeOriginPointCloud( 'gazeorigin-pointcloud', points, colors, normals, timestamps );

    }
     
}