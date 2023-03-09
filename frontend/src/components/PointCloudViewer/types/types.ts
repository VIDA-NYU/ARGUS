export interface SceneData {

    // TODO: define interface

}


export interface VoxelCube {

    center: number[],
    width: number,
    height: number,
    depth: number

}


export interface RenderParameters {

    gazepointcloud: boolean,
    projectedgazepointcloud: boolean,
    worldpointcloud: boolean

}

export interface RenderStyle {

    pointCloudName: string, 
    size: number,
    opacity: number

}



// TODO: Remove it once we define the final point cloud output from the server
// The server still outputs the raw point clouds. However, we will change it to output downsampled point clouds (voxelized)


// export interface WorldPointCloudRaw {

//     // primitive attributes
//     time: string;
//     timestamp: string;
//     color: [number,number,number][];
//     xyz_world: [number, number, number][];

// }


export interface WorldPointCloudRaw {

    colors: [number,number,number][]
    normals: [number, number, number][];
    xyz_world: [number, number, number][];
}



export interface GazePointCloudRaw {

    timestamp: string;
    Timestamp: number;

    GazeOrigin: {x: number, y: number, z: number};
    GazeDirection: {x: number, y: number, z: number};

    HeadMovementDirection: {x: number, y: number, z: number};
    HeadVelocity: {x: number, y: number, z: number};

    IsEyeCalibrationValid: boolean;
    IsEyeTrackingDataValid: boolean;
    IsEyeTrackingEnabled: boolean;
    IsEyeTrackingEnabledAndValid: boolean;

}