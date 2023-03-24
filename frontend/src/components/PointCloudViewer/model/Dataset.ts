// grids
import { WorldVoxelGrid } from "./voxel/WorldVoxelGrid";

// loaders
import { DataLoader } from "../loaders/DataLoader";

// renderables
import { PointCloud } from "./renderables/PointCloud";
import { VoxelCloud } from "./renderables/VoxelCloud";
import { DataUtils } from "../utils/DataUtils";
import { VoxelCell } from "./voxel/VoxelCell";
import { GazeProjectionPointCloud } from "./renderables/gaze/GazeProjectionPointCloud";
import { Raycaster } from "./raycaster/Raycaster";

import * as THREE from 'three';
import { BASE_COLORS } from "../constants/Constants";
import TimestampManager from "../../../tabs/HistoricalDataView/services/TimestampManager";

export class Dataset {

    // world voxel grid
    public worldVoxelGrid: WorldVoxelGrid;

    // point clouds
    public pointClouds: { [datasetName: string]: PointCloud  } = {};
    public voxelClouds: { [datasetName: string]: VoxelCloud  } = {};
    public videos: { [videoName: string]: string } = {};

    // model outputs
    public perception: { [timestamp: number]: { [className: string]: number }  } = {};
    
    constructor( rawData: any ){

        this.initialize_dataset( rawData );

    }

    public initialize_dataset( rawData: any ): void {

        // saving point clouds
        this.pointClouds = DataLoader.load_point_clouds( rawData );
        
        // saving videos
        this.videos = this.store_videos( rawData );   

        // saving models data
        this.perception = DataLoader.load_perception_data( rawData.modelData.perception);

    }  

    public create_density_voxel_clouds(): void {

        const pointCloudNames: string [] = [
            'gazeorigin-pointcloud', 
            'lefthands-pointcloud',
            'righthands-pointcloud',
            'gazeprojection-pointcloud'
        ]

        // getting available point clouds
        const pointClouds: PointCloud[] = this.get_point_clouds( pointCloudNames );

        // voxel grid
        const worldVoxelGrid: WorldVoxelGrid = this.worldVoxelGrid;

        // adding point clouds
        const voxelClouds: { [ voxelCloudName: string ]: VoxelCloud } = {};
        pointClouds.forEach( (pointCloud: PointCloud ) => {

            const pointCloudVoxelCells: VoxelCell[] = worldVoxelGrid.get_point_cloud_voxel_cells(pointCloud.name);
            const voxelCloud: VoxelCloud = new VoxelCloud( `${pointCloud.name.split('-')[0]}-voxelcloud`, pointCloudVoxelCells );

            // coloring voxel cells
            // voxelCloud.color_voxel_cells( pointCloud.get_base_color() );
            voxelCloud.color_voxel_cells_by_density( pointCloud.name );

            voxelClouds[ `${pointCloud.name.split('-')[0]}-voxelcloud` ] = voxelCloud;

        });
        
        this.voxelClouds = voxelClouds;

    }

    public create_model_voxel_cloud( pointCloudNames: string[], modelType: string, className: string = 'cutting board' ): void {

        // voxel grid
        const worldVoxelGrid: WorldVoxelGrid = this.worldVoxelGrid;

        const pointClouds: PointCloud[] = this.get_point_clouds( pointCloudNames );
        pointClouds.forEach( ( pointCloud: PointCloud ) => {

            const pointCloudVoxelCells: VoxelCell[] = worldVoxelGrid.get_point_cloud_voxel_cells( pointCloud.name );
            // const voxelCloud: VoxelCloud = new VoxelCloud( `${pointCloud.name.split('-')[0]}-${className}-voxelcloud`, pointCloudVoxelCells );
            const voxelCloud: VoxelCloud = new VoxelCloud( `model-voxelcloud`, pointCloudVoxelCells );

            // getting timestamps
            const cellIndices: number[][] = voxelCloud.get_cell_indices( pointCloud.name );

            const voxelCloudConfidences: number[][] = [];
            for(let i = 0; i < cellIndices.length; i++){

                const cellConfidences: number[] = [];
                for(let j = 0; j < cellIndices[i].length; j++){
                    
                    const currentIndex: number = cellIndices[i][j];
                    const currentTimestamp: number = this.pointClouds[pointCloud.name].timestamps[currentIndex]
                    const closestModelTimestamp: number = TimestampManager.get_closest_timestamp( modelType, currentTimestamp );
                    
                    let confidence: number = 0;
                    if( className in this.perception[closestModelTimestamp] ){
                        confidence = this.perception[closestModelTimestamp][className];
                    }
                    cellConfidences.push(confidence);
                }
                voxelCloudConfidences.push(cellConfidences);
            }

            voxelCloud.color_voxel_cells_by_model_confidence(voxelCloudConfidences);
            // this.voxelClouds[ `${pointCloud.name.split('-')[0]}-${className}-voxelcloud` ] = voxelCloud;
            this.voxelClouds[ `model-voxelcloud` ] = voxelCloud;
       
        });  

        // this.voxelClouds[ `model-voxelcloud` ];
        
    }

    public store_videos( rawData: any ): { [videoName: string]: string } {
        return { 'mainCamera': rawData.videoData };
    }

    public create_projection( name: string, originPointCloud: PointCloud, targetPointCloud: PointCloud, raycaster: Raycaster ): void {

        try {

            const pointCloud: PointCloud = DataLoader.project_point_cloud( name, originPointCloud, targetPointCloud, raycaster );
            pointCloud.baseColor = BASE_COLORS[name];
            this.pointClouds[name] = pointCloud;

        }catch( exception ){

            console.log('Exception: ', exception );
        
        }


    }

    public create_world_voxel_grid(): void {

        // getting available point clouds
        const pointClouds: PointCloud[] = this.get_point_clouds();

        // adding point clouds
        const extents: number[][] = [];
        pointClouds.forEach( (pointCloud: PointCloud) => {
            
            const currentExtent: number[][] = pointCloud.get_extent();
            extents.push( [ currentExtent[0][0], currentExtent[1][0], currentExtent[2][0] ] );
            extents.push( [ currentExtent[0][1], currentExtent[1][1], currentExtent[2][1] ] );

        });
        
        // calculating global extent
        const globalExtent: number[][] = DataUtils.calculate_extents( extents );

        // creating world voxel grid
        const worldVoxelGrid: WorldVoxelGrid = new WorldVoxelGrid( globalExtent[0], globalExtent[1], globalExtent[2] );
        
        // indexing point clouds
        pointClouds.forEach( (pointCloud: PointCloud) => {
            
            // indexing points withing voxels
            worldVoxelGrid.update_voxel_grid( pointCloud.name, pointCloud.points );

        });

        this.worldVoxelGrid = worldVoxelGrid;


    }

    public get_point_clouds( names: string[] = [] ): PointCloud[] {

        if( names.length === 0 ) return Object.values( this.pointClouds );

        const pointClouds: PointCloud[] = [];
        names.forEach( (name: string) => {
            pointClouds.push(this.pointClouds[name]);  
        });

        return pointClouds;
    }

    public get_voxel_clouds( names: [] = [] ): VoxelCloud[] {

        return Object.values( this.voxelClouds );

    }

    public get_interactive_point_cloud_names(): string[] {

        const interactiveLayers: PointCloud[] = Object.values(this.pointClouds).filter( (pointCloud: PointCloud) => pointCloud.interactive );
        return interactiveLayers.map((pointCloud: PointCloud) => pointCloud.name );

    }     

    

}