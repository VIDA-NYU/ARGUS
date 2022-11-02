export interface MediaState {
    pip?: boolean;
    playing: boolean;
    controls?: boolean;
    light?: boolean;
    played: number;
    duration?: number;
    playbackRate: number;
    loop?: boolean;
    seeking: boolean;
    totalDuration?: string;
    currentTime?: string;
}
  
export interface DeleteInfo {
    name: string,
    confirmation: boolean,
}

export interface WorldPointCloudRaw {

    // primitive attributes
    time: string;
    timestamp: string;
    color: [number,number,number][];
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

export interface VoxelCube {

    center: number[],
    width: number,
    height: number,
    depth: number

}